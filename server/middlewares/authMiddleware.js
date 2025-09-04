import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access Denied. Admins only." });
  }
};
