import jwt from "jsonwebtoken";

export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, cookieOptions);
};

export const clearAuthCookie = (res) => {
  const { maxAge, ...options } = cookieOptions;
  res.clearCookie("token", options);
};