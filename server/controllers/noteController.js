import client from "../config/visionClient.js";
import Note from "../models/Note.js";
import User from "../models/User.js";
import FlashCard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { promises as fs } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { fromPath } from "pdf2pic";

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class NoteController {
  static async saveNote(req, res, next) {
    try {
      const { title } = req.body;
      const userId = req.user.id;

      if (!req.file || req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Please upload a valid PDF file." });
      }

      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      if (user.uploadsUsed >= user.uploadsLimit) {
        return res
          .status(403)
          .json({ message: "Upload limit reached for this week. Contact developer for assistance." });
      }

      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, "../uploads");
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      // Create a temporary file for the uploaded PDF
      const timestamp = Date.now();
      const tempPdfPath = path.join(uploadsDir, `${title}-${timestamp}-temp.pdf`);
      await fs.writeFile(tempPdfPath, req.file.buffer);

      // Set pdf2pic options
      const options = {
        density: 150,
        saveFilename: `${title}-${timestamp}`,
        savePath: uploadsDir,
        format: "png",
        width: 1200,
        height: 1600,
        preserveAspectRatio: true,
      };

      // Use pdf2pic to convert all pages to images
      const convert = fromPath(tempPdfPath, options);
      // -1 means convert all pages
      const images = await convert.bulk(-1, { responseType: "image" });

      // Extract text from all pages using Google Vision OCR
      let allText = "";
      let pageCounter = 1;

      for (const image of images) {
        const imagePath = image.path;

        // Use Google Vision to extract text from each image
        const [visionResult] = await client.documentTextDetection(imagePath);
        const pageText = visionResult.fullTextAnnotation?.text || "";

        // Append text with page separator
        if (allText) allText += "\n\n--- Page Break ---\n\n";
        allText += pageText;

        // Delete the image file after extracting text
        await fs.unlink(imagePath).catch((err) => console.error(`Error deleting image ${pageCounter}:`, err));

        pageCounter++;
      }

      user.uploadsUsed += 1;
      await user.save();

      // Save to DB
      const newNote = new Note({
        title,
        extractedText: allText,
        user: userId,
      });
      await newNote.save();

      // Clean up temporary PDF file
      await fs.unlink(tempPdfPath).catch((err) => console.error("Error deleting temp PDF:", err));

      res.status(201).json({
        message: "Note saved successfully.",
        noteId: newNote._id,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      next(error);
    }
  }

  static async saveNoteImages(req, res, next) {
    try {
      const userId = req.user.id;
      const { title } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Please upload at least one image file." });
      }

      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      if (user.uploadsUsed >= user.uploadsLimit) {
        return res
          .status(403)
          .json({ message: "Upload limit reached for this week. Contact developer for assistance." });
      }

      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, "../uploads");
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      // Process each uploaded image
      const imagePaths = [];
      for (const file of req.files) {
        // Create a temporary file for the uploaded image
        const timestamp = Date.now();
        const tempImagePath = path.join(uploadsDir, `${title}-${timestamp}-temp.png`);
        await fs.writeFile(tempImagePath, file.buffer);
        imagePaths.push(tempImagePath);
      }

      let allText = "";
      let pageCounter = 1;

      // Perform any additional processing on the images (e.g., OCR, saving to DB)
      for (const image of imagePaths) {
        // Use Google Vision to extract text from each image
        const [visionResult] = await client.documentTextDetection(image);
        const pageText = visionResult.fullTextAnnotation?.text || "";

        // Append text with page separator
        if (allText) allText += "\n\n--- Page Break ---\n\n";
        allText += pageText;

        // Delete the image file after extracting text
        await fs.unlink(image).catch((err) => console.error(`Error deleting image ${pageCounter}:`, err));

        pageCounter++;
      }

      // Save to DB
      const newNote = new Note({
        title,
        extractedText: allText,
        user: userId,
      });
      await newNote.save();

      user.uploadsUsed += 1;
      await user.save();

      res.status(201).json({
        message: "Note saved successfully.",
        noteId: newNote._id,
      });
    } catch (error) {
      console.error("Error processing images:", error);
      next(error);
    }
  }

  static async getNotes(req, res, next) {
    try {
      const userId = req.user.id;
      const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });

      if (!notes || notes.length === 0) {
        return res.status(404).json({ message: "No notes found." });
      }

      res.status(200).json(notes);
    } catch (error) {
      next(error);
    }
  }

  static async deleteNote(req, res, next) {
    try {
      const noteId = req.params.id;
      const userId = req.user.id;

      const note = await Note.findOne({ _id: noteId, user: userId });

      if (!note) {
        return res.status(404).json({ message: "Note not found." });
      }
      await Note.deleteOne({ _id: noteId });

      // Find FlashCards and Quizzes associated with this note and delete them
      await FlashCard.deleteMany({ note: noteId });
      await Quiz.deleteMany({ note: noteId });

      res.status(200).json({ message: "Note deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
