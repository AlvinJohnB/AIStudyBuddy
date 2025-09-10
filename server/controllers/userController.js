import User from "../models/User.js";
import bcrypt from "bcrypt";
import Auth from "../middlewares/authMiddleware.js";

export default class UserController {
  // ### Register a new user
  static async registerUser(req, res, next) {
    try {
      const { firstName, lastName, username, email, school, password } = req.body;

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
        firstName,
        lastName,
        email,
        school,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      next(error);
    }
  }

  // ### Login a user
  static async loginUser(req, res, next) {
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

      const token = Auth.createAccessToken(user);

      res.status(200).json({ message: "Login successful.", access: token });
    } catch (error) {
      next(error);
    }
  }

  // ### Get user profile
  static async getUserProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
