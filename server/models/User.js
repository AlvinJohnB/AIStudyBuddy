import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  school: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  uploadsUsed: {
    type: Number,
    default: 0,
  },
  uploadsLimit: {
    type: Number,
    default: 5,
  },
  quizzesGenerated: {
    type: Number,
    default: 0,
  },
  quizzesLimit: {
    type: Number,
    default: 5,
  },
  flashcardsGenerated: {
    type: Number,
    default: 0,
  },
  flashcardsLimit: {
    type: Number,
    default: 5,
  },
  resetDate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
});

const User = mongoose.model("User", userSchema);
export default User;
