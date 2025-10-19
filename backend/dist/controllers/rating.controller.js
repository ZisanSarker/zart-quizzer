"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultipleQuizRatings = exports.rateQuiz = exports.getRatingStats = exports.getRating = void 0;
const quizRating_model_1 = __importDefault(require("../models/quizRating.model"));
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const getRating = async (req, res) => {
    try {
        const { quizId } = req.params;
        const ratings = await quizRating_model_1.default.find({ quizId });
        if (ratings.length === 0) {
            res.json({ rating: 0 });
            return;
        }
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = Number((totalRating / ratings.length).toFixed(2));
        res.json({ rating: averageRating });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching rating', error: error.message });
        return;
    }
};
exports.getRating = getRating;
const getRatingStats = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.userId;
        const ratings = await quizRating_model_1.default.find({ quizId });
        const count = ratings.length;
        const average = count === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / count).toFixed(2));
        let userRating = null;
        if (userId) {
            const userRatingDoc = await quizRating_model_1.default.findOne({ quizId, userId });
            userRating = userRatingDoc ? userRatingDoc.rating : null;
        }
        res.json({ average, count, userRating });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching rating stats', error: error.message });
        return;
    }
};
exports.getRatingStats = getRatingStats;
const rateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { rating } = req.body;
        const userId = req.userId;
        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({ message: 'Rating must be between 1 and 5' });
            return;
        }
        const quiz = await quiz_model_1.default.findById(quizId);
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }
        if (quiz.createdBy?.toString() === userId) {
            res.status(403).json({ message: 'You cannot rate your own quiz' });
            return;
        }
        if (!quiz.isPublic) {
            res.status(403).json({ message: 'You can only rate public quizzes' });
            return;
        }
        const ratingDoc = await quizRating_model_1.default.findOneAndUpdate({ userId, quizId }, { rating, updatedAt: new Date() }, { upsert: true, new: true });
        res.json({ message: 'Rating updated successfully', rating: ratingDoc });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error rating quiz', error: error.message });
        return;
    }
};
exports.rateQuiz = rateQuiz;
const getMultipleQuizRatings = async (req, res) => {
    try {
        const { quizIds } = req.body;
        if (!Array.isArray(quizIds)) {
            res.status(400).json({ message: 'quizIds must be an array' });
            return;
        }
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
        res.json({ ratings: ratingMap });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching multiple ratings', error: error.message });
        return;
    }
};
exports.getMultipleQuizRatings = getMultipleQuizRatings;
//# sourceMappingURL=rating.controller.js.map