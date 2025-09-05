import express from "express";
import QuizController from "../controllers/quizController.js";
import Auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:quizId", Auth.verifyToken, QuizController.getQuizById);
router.post("/:noteId/generate", Auth.verifyToken, QuizController.generateQuiz);

export default router;
