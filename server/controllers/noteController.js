import client from "../config/visionClient.js";
import Note from "../models/Note.js";
import User from "../models/User.js";
import { promises as fs } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { convert } from "pdf-poppler";

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class NoteController {
  static async saveNote(req, res, next) {
    try {
      const { title } = req.body;
      const userId = req.user.id;

      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      // Check limits
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

      // Create output directory for converted images
      const imageOutputDir = path.join(uploadsDir, `${timestamp}-images`);
      try {
        await fs.mkdir(imageOutputDir, { recursive: true });
      } catch (err) {
        console.error("Error creating output directory:", err);
      }

      // Convert PDF to images using pdf-poppler
      const options = {
        format: "png",
        out_dir: imageOutputDir,
        out_prefix: "page",
        page: null, // Convert all pages
        scale: 3.0, // Higher scale for better quality
        dpi: 300, // Higher DPI for better text recognition
      };

      await convert(tempPdfPath, options);

      // Extract text from all pages using Google Vision OCR
      let allText = "";

      // Get all image files from the output directory
      const imageFiles = (await fs.readdir(imageOutputDir))
        .filter((file) => file.endsWith(".png"))
        .sort((a, b) => {
          // Extract page numbers for proper sorting
          const numA = parseInt(a.match(/page-(\d+)/)?.[1] || "0");
          const numB = parseInt(b.match(/page-(\d+)/)?.[1] || "0");
          return numA - numB;
        });

      // Process each page
      for (let i = 0; i < imageFiles.length; i++) {
        const imagePath = path.join(imageOutputDir, imageFiles[i]);

        // Use Google Vision to extract text from each image
        const [visionResult] = await client.documentTextDetection(imagePath);
        const pageText = visionResult.fullTextAnnotation?.text || "";

        // Append text with page separator
        if (allText) allText += "\n\n--- Page Break ---\n\n";
        allText += pageText;

        // Delete the image file after extracting text
        await fs.unlink(imagePath).catch((err) => console.error(`Error deleting image ${i + 1}:`, err));
      }

      // Clean up the image output directory
      try {
        await fs.rmdir(imageOutputDir);
      } catch (err) {
        console.error("Error removing output directory:", err);
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
}
