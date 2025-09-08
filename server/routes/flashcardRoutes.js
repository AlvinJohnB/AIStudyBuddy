import express from "express";
import Auth from "../middlewares/authMiddleware.js";
import FlashCardController from "../controllers/flashcardController.js";

const router = express.Router();

router.post(
  "/:noteId/generate",
  Auth.verifyToken,
  FlashCardController.generateFlashCards
);

export default router;
