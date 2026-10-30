import { Router } from "express";
import {
  addPlannedTodo,
  addExtraTodo,
  listTodos,
  getTodo,
  editTodo,
  removeTodo,
  history,
} from "../controllers/planner.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  handleValidation,
  todoIdRule,
  createPlannedRules,
  createExtraRules,
  updateTodoRules,
  listTodoRules,
  historyRules,
} from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);

router.get("/", listTodoRules, handleValidation, listTodos);
router.post("/", createPlannedRules, handleValidation, addPlannedTodo);

router.post("/extra", createExtraRules, handleValidation, addExtraTodo);
router.get("/history", historyRules, handleValidation, history);

router.get("/:id", todoIdRule, handleValidation, getTodo);
router.patch("/:id", todoIdRule, updateTodoRules, handleValidation, editTodo);
router.delete("/:id", todoIdRule, handleValidation, removeTodo);

export default router;