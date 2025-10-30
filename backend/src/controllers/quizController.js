const quizService = require('../services/quizService');
const ratingService = require('../services/ratingService');
const searchService = require('../services/searchService');
const { validateQuizGeneration, validateQuizSubmission } = require('../validators/quiz');

const generateQuiz = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated. Cannot create quiz.' });
    }

    validateQuizGeneration(req.body);
    const quiz = await quizService.generateQuiz(req.userId, req.body);

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    next(error);
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    validateQuizSubmission({ quizId, answers });

    const result = await quizService.submitQuiz(req.userId || req.body.userId, quizId, answers, timeTaken);

    res.status(201).json({
      message: 'Quiz submitted',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentQuizAttempts = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).json({ 
        message: 'Authentication required',
        attempts: []
      });
    }

    const attempts = await quizService.getRecentQuizAttempts(userId);
    
    if (!Array.isArray(attempts)) {
      console.error('Invalid attempts data returned from service');
      return res.status(200).json([]);
    }

    res.status(200).json(attempts);
  } catch (error) {
    console.error('Error in getRecentQuizAttempts controller:', error);
    res.status(200).json([]);
  }
};

const getRecommendedQuizzes = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;

    const quizzes = await quizService.getPublicQuizzes({
      search: null,
      category: null,
      difficulty: null,
      sort: 'popular',
    });

    if (!Array.isArray(quizzes)) {
      console.error('Invalid quizzes data returned from service');
      return res.status(200).json([]);
    }

    const filteredQuizzes = quizzes
      .filter((quiz) => {
        if (!quiz || !quiz.author || !quiz.author._id) return false;
        const authorId = quiz.author._id?.toString();
        const currentUserId = userId?.toString();
        return authorId && currentUserId && authorId !== currentUserId;
      })
      .slice(0, 10);

    res.status(200).json(filteredQuizzes);
  } catch (error) {
    console.error('Error in getRecommendedQuizzes:', error);
    res.status(200).json([]);
  }
};

const getSavedQuizzes = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const quizzes = await quizService.getSavedQuizzes(userId);
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

const getUserQuizzes = async (req, res, next) => {
  try {
    const quizzes = await quizService.getUserQuizzes(req.params.userId);
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

const getPublicQuizzes = async (req, res, next) => {
  try {
    const { search, category, difficulty, sort } = req.query;

    if (search && search.trim()) {
      await searchService.trackSearchQuery(search);
    }

    const quizzes = await quizService.getPublicQuizzes({
      search,
      category,
      difficulty,
      sort,
    });

    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

const saveQuiz = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: 'quizId is required' });
    }

    await quizService.saveQuiz(userId, quizId);
    res.status(201).json({ message: 'Quiz saved' });
  } catch (error) {
    next(error);
  }
};

const unsaveQuiz = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: 'quizId is required' });
    }

    await quizService.unsaveQuiz(userId, quizId);
    res.status(200).json({ message: 'Quiz removed from saved' });
  } catch (error) {
    next(error);
  }
};

const getQuizAttemptById = async (req, res, next) => {
  try {
    const attempt = await quizService.getQuizAttemptById(req.params.id);
    res.status(200).json(attempt);
  } catch (error) {
    next(error);
  }
};

const getPopularSearchQueries = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const queries = await searchService.getPopularSearchQueries(limit);
    res.status(200).json(queries);
  } catch (error) {
    next(error);
  }
};

const getTrendingQuizzes = async (req, res, next) => {
  try {
    const { limit = 3 } = req.query;
    const quizzes = await quizService.getTrendingQuizzes(limit);
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

const rateQuiz = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = req.user._id;
    const { quizId, rating } = req.body;

    if (!quizId || !rating) {
      return res.status(400).json({ message: 'quizId and rating required' });
    }

    const result = await ratingService.rateQuiz(userId, quizId, rating);

    res.status(200).json({
      message: 'Rating saved',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  generateQuiz,
  getQuizById,
  submitQuiz,
  getRecentQuizAttempts,
  getRecommendedQuizzes,
  getSavedQuizzes,
  getUserQuizzes,
  getPublicQuizzes,
  saveQuiz,
  unsaveQuiz,
  getQuizAttemptById,
  getPopularSearchQueries,
  getTrendingQuizzes,
  rateQuiz,
};

