"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const rating_controller_1 = require("../controllers/rating.controller");
const router = express_1.default.Router();
router.get('/quiz/:quizId', rating_controller_1.getRating);
router.get('/quiz/:quizId/stats', auth_middleware_1.default, rating_controller_1.getRatingStats);
router.post('/quiz/:quizId', auth_middleware_1.default, rating_controller_1.rateQuiz);
router.post('/multiple', auth_middleware_1.default, rating_controller_1.getMultipleQuizRatings);
exports.default = router;
//# sourceMappingURL=rating.routes.js.map