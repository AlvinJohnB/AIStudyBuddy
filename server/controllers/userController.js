import User from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, school, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      school,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    next(error);
  }
};
