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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.get("/", Auth.verifyToken, NoteController.getNotes);

router.post("/", Auth.verifyToken, Auth.checkAndResetLimits, upload.single("file"), NoteController.saveNote);

export default router;
