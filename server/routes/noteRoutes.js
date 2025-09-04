import express from "express";
import NoteController from "../controllers/noteController.js";
import multer from "multer";
import Auth from "../middlewares/authMiddleware.js";
const router = express.Router();

// Multer configuration
const multerStorage = multer.memoryStorage();
export const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post(
  "/notes",
  Auth.verifyToken,
  upload.single("file"),
  NoteController.saveNote
);

export default router;
