import "./utils/polyfills.js";
import dotenv from "dotenv";
// Load environment variables first before other imports
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";

import errorHandler from "./middlewares/errorHandler.js";

import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://ajbregs.com:3000",
  "https://ajbregs.com",
  "https://hedwig.ajbregs.com",
  "http://localhost:5173",
];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

//   Routes
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use("/quizzes", quizRoutes);
app.use("/flashcards", flashcardRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Version 1.0.11`);
});
