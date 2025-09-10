import jwt from "jsonwebtoken";

export default class Auth {
  // Create JWT
  static createAccessToken(user) {
    const data = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
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
}
