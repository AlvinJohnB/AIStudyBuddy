import pdfParse from "pdf-parse";
import Note from "../models/Note.js";

export default class NoteController {
  // ### save a new note
  static async saveNote(req, res, next) {
    try {
      const userId = req.user.id;
      const pdfData = await pdfParse(req.file.buffer);

      const newNote = new Note({ extractedText: pdfData.text, user: userId });
      await newNote.save();
      res.status(201).json({ message: "Note saved successfully." });
    } catch (error) {
      next(error);
    }
  }
}
