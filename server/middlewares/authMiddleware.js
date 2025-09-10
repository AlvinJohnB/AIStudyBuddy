import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default class Auth {
  // Create JWT
  static createAccessToken(user) {
    const data = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  }

  // Verify JWT
  static verifyToken(req, res, next) {
    const token = req.headers.authorization?.slice("Bearer ".length).trim();

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = verified;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Verify Admin
  static async verifyAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access Denied. Admins only." });
    }
  }

  // Check ResetDate and reset limits if needed
  static async checkAndResetLimits(req, res, next) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const now = new Date();
      if (now >= user.resetDate) {
        user.uploadsUsed = 0;
        user.quizzesGenerated = 0;
        user.flashcardsGenerated = 0;
        user.resetDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        await user.save();
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
