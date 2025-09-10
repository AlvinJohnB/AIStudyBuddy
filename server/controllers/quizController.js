import OpenAI from "openai";
import Quiz from "../models/Quiz.js";
import Note from "../models/Note.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Check if API key exists, otherwise log a helpful error
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY is not defined in environment variables. Check your .env file.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

export default class QuizController {
  static async generateQuiz(req, res, next) {
    try {
      const { id } = req.user;
      const { noteId } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.quizzesGenerated >= user.quizzesLimit) {
        return res
          .status(403)
          .json({ message: "Quiz generation limit reached for this week. Contact developer for assistance." });
      }

      const note = await Note.findById(noteId);

      const existingQuiz = await Quiz.findOne({ note: noteId });

      if (existingQuiz) return res.status(400).json({ error: "Quiz already exists for this note" });

      if (!note) return res.status(404).json({ error: "Note not found" });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a quiz generator. Always respond in strict JSON.",
          },
          {
            role: "user",
            content: `
      You are a subject instructor and you are making a quiz for your students on the following notes. If you think that some of the data in the notes is not right, correct it.
      Generate 20 multiple-choice questions from the following notes with a variety of difficulties.
      Each question should have 4 options (A–D) and one correct answer. The correct answer should also be explained thoroughly.
      Return the result in this JSON format ONLY:

      {
        "questions": [
          {
            "question": "string",
            "difficulty": "easy" | "medium" | "hard",
            "options": ["A", "B", "C", "D"],
            "answer": index_of_correct_option (0-3),
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

      const quiz = JSON.parse(response.choices[0].message.content);
      // console.log(quiz);

      //   console.log(response);

      // const quizText = response.choices[0].message.content;
      // console.log("Generated Quiz Text:", quizText);
      user.quizzesGenerated += 1;
      await user.save();

      note.quizGenerated = true;
      await note.save();

      // Format the questions to match the schema
      const formattedQuestions = quiz.questions.map((q) => ({
        question: q.question,
        options: q.options.map((option) => ({ text: option })),
        answer: q.answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      }));

      // Save to DB
      const generatedQuiz = new Quiz({
        user: id,
        title: `Quiz for ${note.title || "Note"}`,
        note: note._id,
        questions: formattedQuestions,
      });
      await generatedQuiz.save();

      res.status(201).json({ message: "Quiz generated" });
    } catch (error) {
      next(error);
    }
  }

  static async getQuizById(req, res, next) {
    try {
      const { quizId } = req.params;
      const quiz = await Quiz.findById(quizId).populate("note", "title");
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });
      res.status(200).json(quiz);
    } catch (error) {
      next(error);
    }
  }

  static async getQuizzes(req, res, next) {
    try {
      const userId = req.user.id;
      const quizzes = await Quiz.find({ user: userId }).sort({ createdAt: -1 });
      if (!quizzes || quizzes.length === 0) {
        return res.status(404).json({ message: "No quizzes found." });
      }
      res.status(200).json(quizzes);
    } catch (error) {
      next(error);
    }
  }
}
