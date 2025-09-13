import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      explanation: { type: String },
    },
  ],
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.models.Flashcard || mongoose.model("Flashcard", flashcardSchema);
