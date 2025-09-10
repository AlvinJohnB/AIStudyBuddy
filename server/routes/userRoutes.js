import express from "express";
import UserController from "../controllers/userController.js";
import Auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

router.get("/details", Auth.verifyToken, UserController.getUserProfile);

export default router;
