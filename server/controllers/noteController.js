import client from "../config/visionClient.js";
import Note from "../models/Note.js";
import { promises as fs } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { pdf } from "pdf-to-img";

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class NoteController {
  static async saveNote(req, res, next) {
    try {
      const { title } = req.body;
      const userId = req.user.id;

      // Create a temporary file for the uploaded PDF
      const timestamp = Date.now();
      const tempPdfPath = path.join(
        __dirname,
        "../uploads",
        `${timestamp}-temp.pdf`
      );
      await fs.writeFile(tempPdfPath, req.file.buffer);

      // Convert PDF to images using pdf-to-img
      // Higher scale means better quality but larger file size
      const document = await pdf(tempPdfPath, { scale: 3 });

      // Extract text from all pages using Google Vision OCR
      let allText = "";
      let pageCounter = 1;

      // Process each page
      for await (const imageBuffer of document) {
        // Write image to file temporarily
        const imagePath = path.join(
          __dirname,
          "../uploads",
          `${timestamp}-page-${pageCounter}.png`
        );
        await fs.writeFile(imagePath, imageBuffer);

        // Use Google Vision to extract text from each image
        const [visionResult] = await client.documentTextDetection(imagePath);
        const pageText = visionResult.fullTextAnnotation?.text || "";

        // Append text with page separator
        if (allText) allText += "\n\n--- Page Break ---\n\n";
        allText += pageText;

        // Delete the image file after extracting text
        await fs
          .unlink(imagePath)
          .catch((err) =>
            console.error(`Error deleting image ${pageCounter}:`, err)
          );

        pageCounter++;
      }

      // Save to DB
      const newNote = new Note({
        title,
        extractedText: allText,
        user: userId,
      });
      await newNote.save();

      // Clean up temporary PDF file
      await fs
        .unlink(tempPdfPath)
        .catch((err) => console.error("Error deleting temp PDF:", err));

      res.status(201).json({
        message: "Note saved successfully.",
        noteId: newNote._id,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      next(error);
    }
  }
}
