import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = req.cookies?.token;

  const header = req.headers.authorization;
  if (!token && header?.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError" ? "Session expired" : "Invalid token";
    return res.status(401).json({ message });
  }
};