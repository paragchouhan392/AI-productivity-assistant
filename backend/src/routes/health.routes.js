import { Router } from "express";
import { query } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT NOW() AS time");
    res.json({ status: "ok", dbTime: result.rows[0].time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Database unreachable" });
  }
});

export default router;