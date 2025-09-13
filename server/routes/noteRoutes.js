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

export const imagesUpload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 40 * 1024 * 1024, // 40MB limit
  },
});

router.get("/", Auth.verifyToken, NoteController.getNotes);

router.post("/", Auth.verifyToken, Auth.checkAndResetLimits, upload.single("file"), NoteController.saveNote);

router.post(
  "/images",
  Auth.verifyToken,
  Auth.checkAndResetLimits,
  imagesUpload.array("images", 5), // Limit to 5 images
  NoteController.saveNoteImages
);

router.delete("/:id", Auth.verifyToken, NoteController.deleteNote);

export default router;
