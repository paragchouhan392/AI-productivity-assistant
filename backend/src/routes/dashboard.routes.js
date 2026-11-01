import { Router } from "express";
import { overview, heatmap, trends } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  handleValidation,
  heatmapRules,
  trendsRules,
} from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);

router.get("/overview", overview);
router.get("/heatmap", heatmapRules, handleValidation, heatmap);
router.get("/trends", trendsRules, handleValidation, trends);

export default router;