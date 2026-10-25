import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  registerRules,
  loginRules,
  handleValidation,
} from "../middleware/validate.middleware.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, registerRules, handleValidation, register);
router.post("/login", authLimiter, loginRules, handleValidation, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;