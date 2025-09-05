import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          text: {
            type: String,
            required: true,
          },
        },
      ],
      answer: {
        type: Number,
      },
      explanation: {
        type: String,
      },
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Quiz", quizSchema);
