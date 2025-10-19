"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("../controllers/quiz.controller");
const router = express_1.default.Router();
router.get('/explore', quiz_controller_1.getPublicQuizzes);
router.get('/trending', quiz_controller_1.getTrendingQuizzes);
router.get('/popular-search-queries', quiz_controller_1.getPopularSearchQueries);
router.get('/:id', quiz_controller_1.getQuizById);
exports.default = router;
//# sourceMappingURL=quiz-public.routes.js.map