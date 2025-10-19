"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularSearchQueries = exports.getTrendingQuizzes = exports.getQuizRatings = exports.unsaveQuiz = exports.saveQuiz = exports.getPublicQuizzes = exports.getUserQuizzes = exports.getSavedQuizzes = exports.getRecommendedQuizzes = exports.getRecentQuizAttempts = exports.getQuizAttemptById = exports.submitQuiz = exports.getQuizById = exports.getAllQuizzes = exports.generateQuiz = void 0;
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const quizPrompt_model_1 = __importDefault(require("../models/quizPrompt.model"));
const quizAttempt_model_1 = __importDefault(require("../models/quizAttempt.model"));
const savedQuiz_model_1 = __importDefault(require("../models/savedQuiz.model"));
const quizRating_model_1 = __importDefault(require("../models/quizRating.model"));
const searchQuery_model_1 = __importDefault(require("../models/searchQuery.model"));
const moment_1 = __importDefault(require("moment"));
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const getMultipleQuizRatings = async (quizIds) => {
    const ratings = await quizRating_model_1.default.find({ quizId: { $in: quizIds } });
    const ratingMap = {};
    quizIds.forEach(quizId => {
        ratingMap[quizId] = 0;
    });
    const ratingsByQuiz = {};
    ratings.forEach(rating => {
        const key = rating.quizId.toString();
        if (!ratingsByQuiz[key]) {
            ratingsByQuiz[key] = [];
        }
        ratingsByQuiz[key].push(rating.rating);
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
    if (description)
        base += `\nDescription: ${description}`;
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
    }
    else if (quizType === 'multiple-choice') {
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
    }
    else if (quizType === 'mixed') {
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
const generateQuiz = async (req, res) => {
    try {
        const { topic, description, difficulty = 'medium', numberOfQuestions = 5, quizType = 'multiple-choice', isPublic = false, timeLimit = true, } = req.body;
        const prompt = await quizPrompt_model_1.default.create({
            topic,
            description,
            difficulty,
            numberOfQuestions,
            quizType,
        });
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: 'User not authenticated. Cannot create quiz.' });
            return;
        }
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(buildPrompt(topic, description, difficulty, numberOfQuestions, quizType));
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
                type: quizType === 'mixed'
                    ? (q.options && q.options.length === 2 ? 'true-false' : 'multiple-choice')
                    : quizType
            }));
        }
        catch (jsonErr) {
            res.status(500).json({
                message: 'Failed to parse Gemini response',
                error: jsonErr.message,
            });
            return;
        }
        const quiz = await quiz_model_1.default.create({
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
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Quiz generation failed', error: err.message });
        return;
    }
};
exports.generateQuiz = generateQuiz;
const getAllQuizzes = async (_req, res) => {
    try {
        const quizzes = await quiz_model_1.default.find().sort({ createdAt: -1 });
        const quizIds = quizzes.map(quiz => quiz._id.toString());
        const ratingsMap = await getMultipleQuizRatings(quizIds);
        const quizzesWithRatings = quizzes.map(quiz => ({
            ...quiz.toObject(),
            averageRating: ratingsMap[quiz._id.toString()] || 0
        }));
        res.status(200).json(quizzesWithRatings);
    }
    catch (_err) {
        res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};
exports.getAllQuizzes = getAllQuizzes;
const getQuizById = async (req, res) => {
    try {
        const quiz = await quiz_model_1.default.findById(req.params.id);
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }
        const ratings = await quizRating_model_1.default.find({ quizId: quiz._id });
        const averageRating = ratings.length === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2));
        const quizWithRating = {
            ...quiz.toObject(),
            averageRating
        };
        res.status(200).json(quizWithRating);
        return;
    }
    catch (_err) {
        res.status(500).json({ message: 'Error retrieving quiz' });
        return;
    }
};
exports.getQuizById = getQuizById;
const submitQuiz = async (req, res) => {
    try {
        const { quizId, userId, answers, timeTaken } = req.body;
        const quiz = await quiz_model_1.default.findById(quizId);
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }
        let score = 0;
        const resultAnswers = [];
        for (const userAnswer of answers) {
            const question = quiz.questions.id(userAnswer._id);
            if (!question)
                continue;
            const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
            if (isCorrect)
                score++;
            resultAnswers.push({
                questionId: userAnswer._id,
                selectedAnswer: userAnswer.selectedAnswer,
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
            });
        }
        const attempt = await quizAttempt_model_1.default.create({
            userId,
            quizId,
            answers: resultAnswers,
            score,
            timeTaken: typeof timeTaken === 'number' ? timeTaken : 0,
        });
        res.status(201).json({
            message: 'Quiz submitted',
            score,
            total: quiz.questions.length,
            result: resultAnswers,
            attemptId: attempt._id,
        });
        return;
    }
    catch (_error) {
        res.status(500).json({ message: 'Failed to submit quiz' });
        return;
    }
};
exports.submitQuiz = submitQuiz;
const getQuizAttemptById = async (req, res) => {
    try {
        const attempt = await quizAttempt_model_1.default.findById(req.params.id).populate('quizId');
        if (!attempt) {
            res.status(404).json({ message: 'Result not found' });
            return;
        }
        res.json(attempt);
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch result', error: err.message });
        return;
    }
};
exports.getQuizAttemptById = getQuizAttemptById;
const getRecentQuizAttempts = async (req, res) => {
    try {
        const userId = req.user?._id || req.userId;
        if (!userId) {
            res
                .status(400)
                .json({ message: 'User ID not found. Authentication failed.' });
            return;
        }
        const attempts = await quizAttempt_model_1.default.find({ userId })
            .sort({ submittedAt: -1 })
            .populate('quizId');
        if (attempts.length === 0) {
            res.status(200).json([]);
            return;
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
                date: (0, moment_1.default)(attempt.submittedAt).fromNow(),
                quizId: quiz._id,
                quizTitle: `${quiz.topic} - ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}`,
                totalQuestions,
                correctAnswers,
                timeTaken,
                completedAt,
            };
        });
        res.status(200).json(recentQuizzes);
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch recent quizzes', error: err.message });
        return;
    }
};
exports.getRecentQuizAttempts = getRecentQuizAttempts;
const getRecommendedQuizzes = async (req, res) => {
    try {
        const userId = req.user?._id || req.userId;
        const filter = {
            createdBy: { $ne: userId },
            isPublic: true,
        };
        let quizzes = await quiz_model_1.default.find(filter)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        const quizIds = quizzes.map(quiz => quiz._id.toString());
        const ratingsMap = await getMultipleQuizRatings(quizIds);
        const recommendedQuizzes = quizzes
            .map(quiz => ({
            id: quiz._id,
            title: `${quiz.topic} - ${quiz.questions[0]?.questionText || 'Untitled'}`,
            author: quiz.createdBy ? quiz.createdBy.name : 'Unknown',
            difficulty: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1),
            averageRating: ratingsMap[quiz._id.toString()] || 0,
        }))
            .sort((a, b) => {
            if (b.averageRating !== a.averageRating) {
                return b.averageRating - a.averageRating;
            }
            return 0;
        })
            .slice(0, 10);
        res.status(200).json(recommendedQuizzes);
    }
    catch (err) {
        res.status(500).json({
            message: 'Failed to fetch recommended quizzes',
            error: err.message,
        });
    }
};
exports.getRecommendedQuizzes = getRecommendedQuizzes;
const getSavedQuizzes = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const saved = await savedQuiz_model_1.default.find({ userId }).populate({
            path: 'quizId',
            populate: { path: 'createdBy', select: 'name' },
        });
        const quizzes = saved
            .map(item => item.quizId)
            .filter(Boolean);
        const quizIds = quizzes.map(quiz => quiz._id.toString());
        const ratingsMap = await getMultipleQuizRatings(quizIds);
        const quizzesWithRatings = quizzes.map(quiz => ({
            ...quiz.toObject(),
            author: quiz.createdBy?.name || 'Unknown',
            averageRating: ratingsMap[quiz._id.toString()] || 0
        }));
        res.status(200).json(quizzesWithRatings);
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch saved quizzes', error: err.message });
        return;
    }
};
exports.getSavedQuizzes = getSavedQuizzes;
const getUserQuizzes = async (req, res) => {
    try {
        const userId = req.params.userId;
        const quizzes = await quiz_model_1.default.find({ createdBy: userId });
        res.status(200).json(quizzes);
    }
    catch (_err) {
        res.status(500).json({ message: 'Failed to fetch user quizzes' });
    }
};
exports.getUserQuizzes = getUserQuizzes;
const getAttemptsAndRating = async (quizId) => {
    const attempts = await quizAttempt_model_1.default.distinct('userId', { quizId }).then(list => list.length);
    const ratings = await quizRating_model_1.default.find({ quizId });
    const rating = ratings.length === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2));
    return {
        attempts,
        rating,
        ratingCount: ratings.length
    };
};
const trackSearchQuery = async (query) => {
    if (!query || query.trim().length < 2)
        return;
    const trimmedQuery = query.trim().toLowerCase();
    try {
        await searchQuery_model_1.default.findOneAndUpdate({ query: trimmedQuery }, {
            $inc: { count: 1 },
            $set: { lastSearched: new Date() }
        }, { upsert: true });
    }
    catch (error) {
        console.error('Error tracking search query:', error);
    }
};
const getPublicQuizzes = async (req, res) => {
    try {
        const { search, category, difficulty, sort = 'recent' } = req.query;
        if (search && search.trim()) {
            await trackSearchQuery(search);
        }
        const filter = { isPublic: true };
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            filter.$or = [
                { topic: searchRegex },
                { description: searchRegex },
                { tags: searchRegex }
            ];
        }
        if (category && category !== 'All Categories') {
            filter.$or = filter.$or || [];
            filter.$or.push({ topic: new RegExp(category, 'i') }, { tags: new RegExp(category, 'i') });
        }
        if (difficulty && difficulty !== 'All Levels') {
            const difficultyMap = {
                'Beginner': 'easy',
                'Intermediate': 'medium',
                'Advanced': 'hard'
            };
            const backendDifficulty = difficultyMap[difficulty] || difficulty.toLowerCase();
            filter.difficulty = backendDifficulty;
        }
        let sortObj = {};
        switch (sort) {
            case 'popular':
                sortObj = { rating: -1, attempts: -1 };
                break;
            case 'trending':
                sortObj = { attempts: -1, rating: -1 };
                break;
            case 'recent':
            default:
                sortObj = { createdAt: -1 };
                break;
        }
        const quizzes = await quiz_model_1.default.find(filter)
            .sort(sortObj)
            .populate({ path: 'createdBy', select: 'username profilePicture _id' });
        const mapped = await Promise.all(quizzes.map(async (q) => {
            const { attempts, rating, ratingCount } = await getAttemptsAndRating(q._id.toString());
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
                    avatar: q.createdBy?.profilePicture || '',
                    initials: q.createdBy?.username ? q.createdBy.username.split(' ').map((n) => n[0]).join('').toUpperCase() : '',
                    _id: q.createdBy?._id,
                }
            };
        }));
        res.status(200).json(mapped);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch public quizzes', error: err.message });
    }
};
exports.getPublicQuizzes = getPublicQuizzes;
const saveQuiz = async (req, res) => {
    try {
        const userId = req.user._id;
        const { quizId } = req.body;
        if (!quizId) {
            res.status(400).json({ message: 'quizId is required' });
            return;
        }
        const exists = await savedQuiz_model_1.default.findOne({ userId, quizId });
        if (exists) {
            res.status(400).json({ message: 'Quiz already saved' });
            return;
        }
        await savedQuiz_model_1.default.create({ userId, quizId });
        res.status(201).json({ message: 'Quiz saved' });
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to save quiz', error: err.message });
        return;
    }
};
exports.saveQuiz = saveQuiz;
const unsaveQuiz = async (req, res) => {
    try {
        const userId = req.user._id;
        const { quizId } = req.body;
        if (!quizId) {
            res.status(400).json({ message: 'quizId is required' });
            return;
        }
        await savedQuiz_model_1.default.findOneAndDelete({ userId, quizId });
        res.status(200).json({ message: 'Quiz removed from saved' });
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to remove saved quiz', error: err.message });
        return;
    }
};
exports.unsaveQuiz = unsaveQuiz;
const getQuizRatings = async (req, res) => {
    try {
        const quizId = req.params.id;
        const userId = req.query.user === 'true' && req.user && req.user._id ? req.user._id : null;
        const ratingStats = await (async () => {
            const ratings = await quizRating_model_1.default.find({ quizId });
            const count = ratings.length;
            const average = count === 0 ? 0 : Number((ratings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(2));
            let userRating = null;
            if (userId) {
                const userRatingDoc = await quizRating_model_1.default.findOne({ quizId, userId });
                userRating = userRatingDoc ? userRatingDoc.rating : null;
            }
            return { average, count, userRating };
        })();
        res.status(200).json(ratingStats);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch ratings', error: err.message });
    }
};
exports.getQuizRatings = getQuizRatings;
const getTrendingQuizzes = async (req, res) => {
    try {
        const { limit = 3 } = req.query;
        const trendingQuizzes = await quiz_model_1.default.find({ isPublic: true })
            .sort({ attempts: -1, rating: -1 })
            .limit(parseInt(limit))
            .populate({ path: 'createdBy', select: 'username profilePicture _id' });
        const mapped = await Promise.all(trendingQuizzes.map(async (q) => {
            const { attempts, rating, ratingCount } = await getAttemptsAndRating(q._id.toString());
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
                    avatar: q.createdBy?.profilePicture || '',
                    initials: q.createdBy?.username ? q.createdBy.username.split(' ').map((n) => n[0]).join('').toUpperCase() : '',
                    _id: q.createdBy?._id,
                }
            };
        }));
        res.status(200).json(mapped);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch trending quizzes', error: err.message });
    }
};
exports.getTrendingQuizzes = getTrendingQuizzes;
const getPopularSearchQueries = async (_req, res) => {
    try {
        const queries = await searchQuery_model_1.default.find()
            .sort({ count: -1 })
            .limit(10)
            .select('query count');
        res.status(200).json(queries);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch popular search queries', error: err.message });
    }
};
exports.getPopularSearchQueries = getPopularSearchQueries;
//# sourceMappingURL=quiz.controller.js.map