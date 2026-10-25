import bcrypt from "bcryptjs";
import {
  findByEmail,
  findByUserName,
  findById,
  createUser,
} from "../models/user.model.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";

const SALT_ROUNDS = 12;
// Used to keep login timing similar when the email doesn't exist
const DUMMY_HASH = bcrypt.hashSync("dummy-password", SALT_ROUNDS);

export const register = async (req, res, next) => {
  try {
    const { email, user_name, password } = req.body;

    if (await findByEmail(email)) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    if (await findByUserName(user_name)) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({
      email,
      userName: user_name,
      passwordHash,
    });

    const token = signToken(user.id);
    setAuthCookie(res, token);

    res.status(201).json({
      message: "Registration successful",
      user: { id: user.id, email: user.email, user_name: user.user_name },
      token,
    });
  } catch (err) {
    // Unique violation (race condition between check and insert)
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email or username already exists" });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(email);
    const hashToCompare = user ? user.password_hash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user.id);
    setAuthCookie(res, token);

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, user_name: user.user_name },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req, res, next) => {
  console.log("req.user:", req.user);
  try {
    const user = await findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};