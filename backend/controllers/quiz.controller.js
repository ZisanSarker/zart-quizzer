const Quiz = require('../models/quiz.model');
const QuizPrompt = require('../models/quizPrompt.model');
const QuizAttempt = require('../models/quizAttempt.model');
const SavedQuiz = require('../models/savedQuiz.model');
const moment = require('moment');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

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
    "options": ["...", "...", "...", "..."], // or ["True", "False"]
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
      console.log(req.user)
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
    console.error(err);
    res.status(500).json({ message: 'Quiz generation failed', error: err.message });
  }
}

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving quiz' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, userId, answers } = req.body;

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
    });

    res.status(201).json({
      message: 'Quiz submitted',
      score,
      total: quiz.questions.length,
      result: resultAnswers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};

exports.getRecentQuizAttempts = async (req, res) => {
  try {
    if (!req.userId) {
      return res
        .status(400)
        .json({ message: 'User ID not found. Authentication failed.' });
    }

    const attempts = await QuizAttempt.find({ userId: req.userId })
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
    console.error(err);
    res
      .status(500)
      .json({ message: 'Failed to fetch recent quizzes', error: err.message });
  }
};

exports.getRecommendedQuizzes = async (req, res) => {
  try {
    const userId = req.userId; // Make sure this is set by your auth middleware

    // 1. Find all quizzes the user has attempted
    const attemptedQuizIds = await QuizAttempt.find({ userId }).distinct('quizId');

    // 2. Find user's most common topics and difficulty
    const userAttempts = await QuizAttempt.find({ userId }).populate('quizId');
    let favTopics = [];
    let favDifficulty = [];
    if (userAttempts.length > 0) {
      const topicCount = {};
      const diffCount = {};
      userAttempts.forEach(a => {
        if (a.quizId) {
          topicCount[a.quizId.topic] = (topicCount[a.quizId.topic] || 0) + 1;
          diffCount[a.quizId.difficulty] = (diffCount[a.quizId.difficulty] || 0) + 1;
        }
      });
      // Top topic(s) and difficulty
      favTopics = Object.entries(topicCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([topic]) => topic);
      favDifficulty = Object.entries(diffCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1)
        .map(([diff]) => diff);
    }

    // 3. Find quizzes the user hasn't tried or created
    const filter = {
      _id: { $nin: attemptedQuizIds },
      createdBy: { $ne: userId },
      isPublic: true,
    };

    // 4. Prefer favorite topics/difficulty, fallback to recency
    let quizzes = await Quiz.find({
      ...filter,
      ...(favTopics.length > 0 ? { topic: { $in: favTopics } } : {}),
      ...(favDifficulty.length > 0 ? { difficulty: { $in: favDifficulty } } : {}),
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name');

    // 5. If not enough, fill with other public quizzes not yet attempted/created
    if (quizzes.length < 10) {
      const moreQuizzes = await Quiz.find(filter)
        .sort({ createdAt: -1 })
        .limit(10 - quizzes.length)
        .populate('createdBy', 'name');
      // To avoid duplicates:
      const existingIds = new Set(quizzes.map(q => String(q._id)));
      quizzes = quizzes.concat(moreQuizzes.filter(q => !existingIds.has(String(q._id))));
    }

    // 6. Format for frontend
    const recommendedQuizzes = quizzes.map(quiz => ({
      id: quiz._id,
      title: `${quiz.topic} - ${quiz.questions[0]?.questionText || 'Untitled'}`,
      author: quiz.createdBy ? quiz.createdBy.name : 'Unknown',
      difficulty: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1),
    }));

    res.status(200).json(recommendedQuizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to fetch recommended quizzes',
      error: err.message,
    });
  }
};

exports.getSavedQuizzes = async (req, res) => {
  try {
    const userId = req.userId;
    const saved = await SavedQuiz.find({ userId }).populate({
      path: 'quizId',
      populate: { path: 'createdBy', select: 'name' },
    });
    const quizzes = saved
      .map(item => item.quizId)
      .filter(Boolean)
      .map(quiz => ({
        ...quiz.toObject(),
        author: quiz.createdBy?.name || 'Unknown'
      }));
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch saved quizzes' });
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