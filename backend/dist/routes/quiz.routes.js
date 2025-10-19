"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("../controllers/quiz.controller");
const router = express_1.default.Router();
router.post('/generate', quiz_controller_1.generateQuiz);
router.post('/submit', quiz_controller_1.submitQuiz);
router.post('/save', quiz_controller_1.saveQuiz);
router.post('/unsave', quiz_controller_1.unsaveQuiz);
router.get('/recent', quiz_controller_1.getRecentQuizAttempts);
router.get('/recommended', quiz_controller_1.getRecommendedQuizzes);
router.get('/saved', quiz_controller_1.getSavedQuizzes);
router.get('/user/:userId', quiz_controller_1.getUserQuizzes);
router.get('/quiz-attempts/:id', quiz_controller_1.getQuizAttemptById);
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map