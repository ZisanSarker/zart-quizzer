const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Quiz, QuizPrompt, QuizAttempt, SavedQuiz, QuizRating } = require('../models');
const { NotFoundError, ConflictError } = require('../errors');
const { getRelativeTime } = require('../utils/date');
const ratingService = require('./ratingService');

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

const generateQuiz = async (userId, quizData) => {
  const {
    topic,
    description,
    difficulty = 'medium',
    numberOfQuestions = 5,
    quizType = 'multiple-choice',
    isPublic = false,
    timeLimit = true,
  } = quizData;

  const prompt = await QuizPrompt.create({
    topic,
    description,
    difficulty,
    numberOfQuestions,
    quizType,
  });

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

    questions = questions.map((q) => ({
      ...q,
      type:
        quizType === 'mixed'
          ? q.options && q.options.length === 2
            ? 'true-false'
            : 'multiple-choice'
          : quizType,
    }));
  } catch (jsonErr) {
    throw new Error('Failed to parse Gemini response: ' + jsonErr.message);
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
    createdBy: userId,
  });

  return quiz;
};

const getQuizById = async (quizId) => {
  if (!quizId) {
    throw new NotFoundError('Quiz ID is required');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new NotFoundError('Quiz not found');
  }

  let averageRating = 0;
  try {
    const ratings = await QuizRating.find({ quizId: quiz._id });
    if (ratings && ratings.length > 0) {
      const sum = ratings.reduce((acc, rating) => {
        const ratingValue = typeof rating.rating === 'number' && !isNaN(rating.rating) ? rating.rating : 0;
        return acc + ratingValue;
      }, 0);
      averageRating = Number((sum / ratings.length).toFixed(2));
    }
  } catch (ratingError) {
    console.error('Error fetching ratings:', ratingError);
  }

  return {
    ...quiz.toObject(),
    averageRating,
  };
};

const submitQuiz = async (userId, quizId, answers, timeTaken = 0) => {
  if (!quizId) {
    throw new NotFoundError('Quiz ID is required');
  }

  if (!answers || !Array.isArray(answers)) {
    throw new Error('Invalid answers format');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new NotFoundError('Quiz not found');
  }

  if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new Error('Quiz has no questions');
  }

  let score = 0;
  const resultAnswers = [];

  for (const userAnswer of answers) {
    if (!userAnswer || !userAnswer._id) continue;

    const question = quiz.questions.id(userAnswer._id);
    if (!question) continue;

    const selectedAnswer = userAnswer.selectedAnswer || '';
    const correctAnswer = question.correctAnswer || '';
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) score++;

    resultAnswers.push({
      questionId: userAnswer._id,
      selectedAnswer,
      isCorrect,
      correctAnswer,
      explanation: question.explanation || '',
    });
  }

  const validTimeTaken = typeof timeTaken === 'number' && !isNaN(timeTaken) && timeTaken >= 0 ? timeTaken : 0;

  const attempt = await QuizAttempt.create({
    userId,
    quizId,
    answers: resultAnswers,
    score,
    timeTaken: validTimeTaken,
  });

  return {
    score,
    total: quiz.questions.length,
    result: resultAnswers,
    attemptId: attempt._id,
  };
};

const getRecentQuizAttempts = async (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const attempts = await QuizAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .populate('quizId')
      .limit(50)
      .lean();

    if (!attempts || attempts.length === 0) {
      return [];
    }

    return attempts
      .filter((attempt) => {
        if (!attempt || !attempt.quizId) return false;
        const quiz = attempt.quizId;
        return quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0;
      })
      .map((attempt) => {
        try {
          const quiz = attempt.quizId;
          const totalQuestions = quiz.questions?.length || 0;
          const score = typeof attempt.score === 'number' && !isNaN(attempt.score) ? attempt.score : 0;
          const correctAnswers = totalQuestions > 0 ? parseFloat(score.toFixed(2)) : 0;
          const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100).toString() : '0';
          const timeTaken = typeof attempt.timeTaken === 'number' && !isNaN(attempt.timeTaken) ? attempt.timeTaken : 0;
          const createdAt = attempt.createdAt instanceof Date ? attempt.createdAt : new Date(attempt.createdAt || Date.now());
          const topic = quiz.topic || 'Untitled Quiz';
          const difficulty = quiz.difficulty || 'medium';
          const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

          return {
            id: attempt._id?.toString() || '',
            title: `${topic} - ${difficultyLabel}`,
            score: percentage,
            date: getRelativeTime(createdAt),
            quizId: quiz._id?.toString() || '',
            quizTitle: `${topic} - ${difficultyLabel}`,
            totalQuestions,
            correctAnswers,
            timeTaken,
            completedAt: createdAt.toISOString(),
          };
        } catch (mapError) {
          console.error('Error mapping quiz attempt:', mapError);
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error in getRecentQuizAttempts:', error);
    return [];
  }
};

const getSavedQuizzes = async (userId) => {
  const saved = await SavedQuiz.find({ userId }).populate({
    path: 'quizId',
    populate: { path: 'createdBy', select: 'username' },
  });

  const quizzes = saved.map((item) => item.quizId).filter(Boolean);

  if (quizzes.length === 0) {
    return [];
  }

  const quizIds = quizzes.map((quiz) => quiz._id);
  const ratingsMap = await ratingService.getMultipleQuizRatings(quizIds);

  return quizzes.map((quiz) => ({
    ...quiz.toObject(),
    author: quiz.createdBy?.username || 'Unknown',
    averageRating: ratingsMap[quiz._id.toString()] || 0,
  }));
};

const saveQuiz = async (userId, quizId) => {
  const exists = await SavedQuiz.findOne({ userId, quizId });
  if (exists) {
    throw new ConflictError('Quiz already saved');
  }

  await SavedQuiz.create({ userId, quizId });
};

const unsaveQuiz = async (userId, quizId) => {
  const deleted = await SavedQuiz.findOneAndDelete({ userId, quizId });
  if (!deleted) {
    throw new NotFoundError('Saved quiz not found');
  }
};

const getAttemptsAndRating = async (quizId) => {
  const attempts = await QuizAttempt.distinct('userId', { quizId });
  const stats = await ratingService.getRatingStats(quizId);
  return {
    attempts: attempts.length,
    rating: stats.average,
    ratingCount: stats.count,
  };
};

const getPublicQuizzes = async (filters) => {
  const { search, category, difficulty, sort = 'recent' } = filters;

  let filter = { isPublic: true };

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { topic: searchRegex },
      { description: searchRegex },
      { tags: searchRegex },
    ];
  }

  if (category && category !== 'All Categories') {
    filter.$or = filter.$or || [];
    filter.$or.push(
      { topic: new RegExp(category, 'i') },
      { tags: new RegExp(category, 'i') }
    );
  }

  if (difficulty && difficulty !== 'All Levels') {
    const difficultyMap = {
      Beginner: 'easy',
      Intermediate: 'medium',
      Advanced: 'hard',
    };
    const backendDifficulty =
      difficultyMap[difficulty] || difficulty.toLowerCase();
    filter.difficulty = backendDifficulty;
  }

  let sortObj = {};
  switch (sort) {
    case 'popular':
      sortObj = { createdAt: -1 };
      break;
    case 'trending':
      sortObj = { createdAt: -1 };
      break;
    case 'recent':
    default:
      sortObj = { createdAt: -1 };
      break;
  }

  const quizzes = await Quiz.find(filter)
    .sort(sortObj)
    .populate({ path: 'createdBy', select: 'username profilePicture _id' });

  const mapped = await Promise.all(
    quizzes.map(async (q) => {
      const { attempts, rating, ratingCount } = await getAttemptsAndRating(
        q._id
      );
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
        ratingCount,
        author: {
          name: q.createdBy?.username || 'Unknown',
          avatar: (q.createdBy?.profilePicture && q.createdBy.profilePicture !== 'default.jpg') ? q.createdBy.profilePicture : '',
          initials: q.createdBy?.username
            ? q.createdBy.username
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            : '',
          _id: q.createdBy?._id,
        },
      };
    })
  );

  return mapped;
};

const getUserQuizzes = async (userId) => {
  return await Quiz.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const getTrendingQuizzes = async (limit = 3) => {
  const quizzes = await Quiz.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate({ path: 'createdBy', select: 'username profilePicture _id' });

  const mapped = await Promise.all(
    quizzes.map(async (q) => {
      const { attempts, rating, ratingCount } = await getAttemptsAndRating(
        q._id
      );
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
        ratingCount,
        author: {
          name: q.createdBy?.username || 'Unknown',
          avatar: (q.createdBy?.profilePicture && q.createdBy.profilePicture !== 'default.jpg') ? q.createdBy.profilePicture : '',
          initials: q.createdBy?.username
            ? q.createdBy.username
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            : '',
          _id: q.createdBy?._id,
        },
      };
    })
  );

  return mapped;
};

const getQuizAttemptById = async (attemptId) => {
  const attempt = await QuizAttempt.findById(attemptId).populate('quizId');
  if (!attempt) {
    throw new NotFoundError('Quiz attempt not found');
  }
  return attempt;
};

module.exports = {
  generateQuiz,
  getQuizById,
  submitQuiz,
  getRecentQuizAttempts,
  getSavedQuizzes,
  saveQuiz,
  unsaveQuiz,
  getPublicQuizzes,
  getUserQuizzes,
  getTrendingQuizzes,
  getQuizAttemptById,
};

