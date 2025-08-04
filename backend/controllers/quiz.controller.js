const Quiz = require('../models/quiz.model');
const QuizPrompt = require('../models/quizPrompt.model');
const QuizAttempt = require('../models/quizAttempt.model');
const SavedQuiz = require('../models/savedQuiz.model');
const QuizRating = require('../models/quizRating.model');
const moment = require('moment');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const getMultipleQuizRatings = async (quizIds) => {
  const ratings = await QuizRating.find({ quizId: { $in: quizIds } });
  const ratingMap = {};
  
  quizIds.forEach(quizId => {
    ratingMap[quizId] = 0;
  });
  
  const ratingsByQuiz = {};
  ratings.forEach(rating => {
    if (!ratingsByQuiz[rating.quizId]) {
      ratingsByQuiz[rating.quizId] = [];
    }
    ratingsByQuiz[rating.quizId].push(rating.rating);
  });
  
  Object.keys(ratingsByQuiz).forEach(quizId => {
    const quizRatings = ratingsByQuiz[quizId];
    const average = quizRatings.reduce((sum, rating) => sum + rating, 0) / quizRatings.length;
    ratingMap[quizId] = Number(average.toFixed(2));
  });
  
  return ratingMap;
};

const buildPrompt = (topic, description, difficulty, count, quizType) => {
  let base = `Generate ${count} ${difficulty} level ${quizType} quiz questions on the topic "${topic}".`;
  if (description) base += `\nDescription: ${description}`;

  if (quizType === 'true-false') {
    base += `
Each question should have:
- 1 question text
- 2 options: ["True", "False"]
- 1 correct answer ("True" or "False")
- 1 short explanation

Format the output in JSON like this:
[
  {
    "questionText": "...",
    "options": ["True", "False"],
    "correctAnswer": "...",
    "explanation": "..."
  },
  ...
]
`;
  } else if (quizType === 'multiple-choice') {
    base += `
Each question should have:
- 1 question text
- 4 options
- 1 correct answer
- 1 short explanation

Format the output in JSON like this:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": "...",
    "explanation": "..."
  },
  ...
]
`;
  } else if (quizType === 'mixed') {
    base += `
Generate a mix of both multiple-choice and true/false questions. 
For multiple-choice: 4 options, for true/false: 2 options ["True", "False"].
Each question should have:
- 1 question text
- options (either 4 for multiple-choice or 2 for true/false)
- 1 correct answer
- 1 short explanation

Format the output in JSON like this:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": "...",
    "explanation": "..."
  },
  ...
]
`;
  }
  return base;
};

exports.generateQuiz = async (req, res) => {
  try {
    const {
      topic,
      description,
      difficulty = 'medium',
      numberOfQuestions = 5,
      quizType = 'multiple-choice',
      isPublic = false,
      timeLimit = true,
    } = req.body;

    const prompt = await QuizPrompt.create({
      topic,
      description,
      difficulty,
      numberOfQuestions,
      quizType,
    });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated. Cannot create quiz." });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(
      buildPrompt(topic, description, difficulty, numberOfQuestions, quizType)
    );
    const response = await result.response;
    const text = response.text();

    let questions;
    try {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      const jsonText = text.slice(start, end + 1);
      questions = JSON.parse(jsonText);

      questions = questions.map(q => ({
        ...q,
        type:
          quizType === 'mixed'
            ? (q.options && q.options.length === 2 ? 'true-false' : 'multiple-choice')
            : quizType
      }));
    } catch (jsonErr) {
      return res.status(500).json({
        message: 'Failed to parse Gemini response',
        error: jsonErr.message,
      });
    }

    const quiz = await Quiz.create({
      topic,
      description,
      quizType,
      difficulty,
      isPublic,
      timeLimit,
      questions,
      promptRef: prompt._id,
      createdBy: req.user._id,
    });
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Quiz generation failed', error: err.message });
  }
}

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    
    const quizIds = quizzes.map(quiz => quiz._id);
    const ratingsMap = await getMultipleQuizRatings(quizIds);
    
    const quizzesWithRatings = quizzes.map(quiz => ({
      ...quiz.toObject(),
      averageRating: ratingsMap[quiz._id] || 0
    }));
    
    res.status(200).json(quizzesWithRatings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    const ratings = await QuizRating.find({ quizId: quiz._id });
    const averageRating = ratings.length === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2));
    
    const quizWithRating = {
      ...quiz.toObject(),
      averageRating
    };
    
    res.status(200).json(quizWithRating);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving quiz' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, userId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    const resultAnswers = [];

    for (const userAnswer of answers) {
      const question = quiz.questions.id(userAnswer._id);
      if (!question) continue;

      const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;

      resultAnswers.push({
        questionId: userAnswer._id,
        selectedAnswer: userAnswer.selectedAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      });
    }

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      answers: resultAnswers,
      score,
      timeTaken: typeof timeTaken === "number" ? timeTaken : 0,
    });

    res.status(201).json({
      message: 'Quiz submitted',
      score,
      total: quiz.questions.length,
      result: resultAnswers,
      attemptId: attempt._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};

exports.getQuizAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id).populate('quizId');
    if (!attempt) return res.status(404).json({ message: 'Result not found' });
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch result', error: err.message });
  }
};

exports.getRecentQuizAttempts = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    
    if (!userId) {
      return res
        .status(400)
        .json({ message: 'User ID not found. Authentication failed.' });
    }

    const attempts = await QuizAttempt.find({ userId })
      .sort({ submittedAt: -1 })
      .populate('quizId');

    if (attempts.length === 0) {
      return res.status(200).json([]);
    }

    const recentQuizzes = attempts
      .filter((attempt) => attempt.quizId)
      .map((attempt) => {
        const quiz = attempt.quizId;
        const totalQuestions = quiz.questions.length;
        const correctAnswers = parseFloat(attempt.score.toFixed(2));
        const percentage = ((attempt.score / totalQuestions) * 100).toFixed(0);
        const timeTaken = attempt.timeTaken || 'N/A';
        const completedAt = attempt.submittedAt.toISOString();

        return {
          id: attempt._id,
          title: `${quiz.topic} - ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}`,
          score: percentage,
          date: moment(attempt.submittedAt).fromNow(),
          quizId: quiz._id,
          quizTitle: `${quiz.topic} - ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}`,
          totalQuestions,
          correctAnswers,
          timeTaken,
          completedAt,
        };
      });
    
    res.status(200).json(recentQuizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent quizzes', error: err.message });
  }
};

exports.getRecommendedQuizzes = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    // Get all public quizzes that are not created by the current user
    const filter = {
      createdBy: { $ne: userId },
      isPublic: true,
    };

    // Get all public quizzes first
    let quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Get ratings for all quizzes
    const quizIds = quizzes.map(quiz => quiz._id);
    const ratingsMap = await getMultipleQuizRatings(quizIds);

    // Map quizzes with their ratings and sort by rating (highest first)
    const recommendedQuizzes = quizzes
      .map(quiz => ({
        id: quiz._id,
        title: `${quiz.topic} - ${quiz.questions[0]?.questionText || 'Untitled'}`,
        author: quiz.createdBy ? quiz.createdBy.name : 'Unknown',
        difficulty: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1),
        averageRating: ratingsMap[quiz._id] || 0,
      }))
      .sort((a, b) => {
        // Sort by rating first (highest first)
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        // If ratings are equal, sort by creation date (newest first)
        return 0;
      })
      .slice(0, 10); // Limit to 10 recommendations

    res.status(200).json(recommendedQuizzes);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch recommended quizzes',
      error: err.message,
    });
  }
};

exports.getSavedQuizzes = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const saved = await SavedQuiz.find({ userId }).populate({
      path: 'quizId',
      populate: { path: 'createdBy', select: 'name' },
    });
    
    const quizzes = saved
      .map(item => item.quizId)
      .filter(Boolean);
    
    const quizIds = quizzes.map(quiz => quiz._id);
    const ratingsMap = await getMultipleQuizRatings(quizIds);
    
    const quizzesWithRatings = quizzes.map(quiz => ({
      ...quiz.toObject(),
      author: quiz.createdBy?.name || 'Unknown',
      averageRating: ratingsMap[quiz._id] || 0
    }));
    
    res.status(200).json(quizzesWithRatings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch saved quizzes', error: err.message });
  }
};

exports.getUserQuizzes = async (req, res) => {
  try {
    const userId = req.params.userId;
    const quizzes = await Quiz.find({ createdBy: userId });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user quizzes' });
  }
};

const getAttemptsAndRating = async (quizId) => {
  const attempts = await QuizAttempt.distinct('userId', { quizId }).then(list => list.length);
  const ratings = await QuizRating.find({ quizId });
  const rating = ratings.length === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2));
  return {
    attempts,
    rating
  };
};

exports.getPublicQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate({ path: 'createdBy', select: 'name avatar initials _id' });

    const mapped = await Promise.all(quizzes.map(async q => {
      const { attempts, rating } = await getAttemptsAndRating(q._id);
      return {
        _id: q._id,
        topic: q.topic,
        description: q.description,
        quizType: q.quizType,
        difficulty: q.difficulty,
        questions: q.questions,
        isPublic: q.isPublic,
        timeLimit: q.timeLimit,
        createdAt: q.createdAt,
        tags: q.tags || [],
        attempts,
        rating,
        author: {
          name: q.createdBy?.name || "Unknown",
          avatar: q.createdBy?.avatar || "",
          initials: q.createdBy?.initials || (q.createdBy?.name ? q.createdBy.name.split(" ").map(n => n[0]).join("").toUpperCase() : ""),
          _id: q.createdBy?._id,
        }
      };
    }));

    res.status(200).json(mapped);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public quizzes', error: err.message });
  }
};

exports.saveQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quizId } = req.body;

    if (!quizId) return res.status(400).json({ message: 'quizId is required' });

    const exists = await SavedQuiz.findOne({ userId, quizId });
    if (exists) return res.status(400).json({ message: 'Quiz already saved' });

    await SavedQuiz.create({ userId, quizId });
    res.status(201).json({ message: 'Quiz saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save quiz', error: err.message });
  }
};

exports.unsaveQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quizId } = req.body;

    if (!quizId) return res.status(400).json({ message: 'quizId is required' });

    await SavedQuiz.findOneAndDelete({ userId, quizId });
    res.status(200).json({ message: 'Quiz removed from saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove saved quiz', error: err.message });
  }
};

exports.getQuizRatings = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.query.user === "true" && req.user && req.user._id ? req.user._id : null;
    
    const ratingStats = await getRatingStats(quizId, userId);
    
    res.status(200).json(ratingStats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ratings', error: err.message });
  }
};

exports.rateQuiz = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const userId = req.user._id;
    const { quizId, rating } = req.body;
    if (!quizId || !rating) return res.status(400).json({ message: 'quizId and rating required' });

    const ratingDoc = await rateQuizUtil(userId, quizId, rating);
    
    const ratingStats = await getRatingStats(quizId);
    
    res.status(200).json({ 
      message: 'Rating saved',
      rating: ratingDoc.rating,
      averageRating: ratingStats.average,
      totalRatings: ratingStats.count
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rate quiz', error: err.message });
  }
};