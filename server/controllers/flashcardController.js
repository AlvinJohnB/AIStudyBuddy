import Flashcard from "../models/Flashcard.js";
import Note from "../models/Note.js";
import User from "../models/User.js";
import OpenAI from "openai";

import dotenv from "dotenv";

dotenv.config();

// Check if API key exists, otherwise log a helpful error
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY is not defined in environment variables. Check your .env file.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

export default class FlashCardController {
  static async generateFlashCards(req, res, next) {
    try {
      const { id } = req.user;
      const { noteId } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.flashcardsGenerated >= user.flashcardsLimit) {
        return res
          .status(403)
          .json({ message: "Flashcard generation limit reached for this week. Contact developer for assistance." });
      }

      const note = await Note.findById(noteId);

      const existingFlashCard = await Flashcard.findOne({ note: noteId });

      if (existingFlashCard) return res.status(400).json({ error: "Flashcard already exists for this note" });

      if (!note) return res.status(404).json({ error: "Note not found" });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a flashcard generator. Always respond in strict JSON.",
          },
          {
            role: "user",
            content: `
      You are assisting a student in their study session and you are making flashcards for your students on the following notes. If you think that some of the data in the notes is not right, correct it.
      Generate 20 flashcards from the following notes with a variety of difficulties.
      Each flashcard should have a question and an answer. If there are mathematical equations in the notes, ask about them for the student to be able to memorize them and give maybe 2 sample problems to check their knowledge. The correct answer should also be explained thoroughly.
      Return the result in this JSON format ONLY:

      {
        "questions": [
          {
            "question": "string",
            "answer": "string",
            "explanation": "string"
          }
        ]
      }

      Notes:
      ${note.extractedText}
      `,
          },
        ],
        response_format: { type: "json_object" },
      });

      const flashcard = JSON.parse(response.choices[0].message.content);
      // console.log(flashcard);

      //   console.log(response);

      // const flashcardText = response.choices[0].message.content;
      // console.log("Generated Flashcard Text:", flashcardText);

      user.flashcardsGenerated += 1;
      await user.save();

      note.flashcardGenerated = true;
      await note.save();

      // Format the questions to match the schema
      const formattedQuestions = flashcard.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        explanation: q.explanation,
      }));

      // Save to DB
      const generatedFlashcard = new Flashcard({
        user: id,
        title: `Flashcard for ${note.title || "Note"}`,
        note: note._id,
        questions: formattedQuestions,
      });
      await generatedFlashcard.save();

      res.status(201).json({ message: "Flashcard generated" });
    } catch (error) {
      next(error);
    }
  }

  static async getFlashcardById(req, res, next) {
    try {
      const { flashcardId } = req.params;
      const flashcard = await Flashcard.findById(flashcardId).populate("note");
      if (!flashcard) return res.status(404).json({ error: "Flashcard not found" });
      res.status(200).json(flashcard);
    } catch (error) {
      next(error);
    }
  }

  static async getFlashcards(req, res, next) {
    try {
      const userId = req.user.id;
      const flashcards = await Flashcard.find({ user: userId }).sort({
        createdAt: -1,
      });
      if (!flashcards || flashcards.length === 0) {
        return res.status(404).json({ message: "No flashcards found." });
      }
      res.status(200).json(flashcards);
    } catch (error) {
      next(error);
    }
  }
}
