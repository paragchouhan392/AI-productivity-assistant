import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { testConnection } from "./src/config/db.js";
import healthRoutes from "./src/routes/health.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import notesRoutes from "./src/routes/notes.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server only after DB connection succeeds
const start = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
};

start();