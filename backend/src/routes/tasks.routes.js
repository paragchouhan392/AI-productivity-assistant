import { Router } from "express";
import {
  addTask,
  listTasks,
  getTask,
  editTask,
  changeStatus,
  removeTask,
  taskStats,
} from "../controllers/tasks.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  handleValidation,
  taskIdRule,
  createTaskRules,
  updateTaskRules,
  taskStatusRules,
  listTasksRules,
} from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);

router.get("/stats", taskStats);

router.get("/", listTasksRules, handleValidation, listTasks);
router.post("/", createTaskRules, handleValidation, addTask);

router.get("/:id", taskIdRule, handleValidation, getTask);
router.patch("/:id", taskIdRule, updateTaskRules, handleValidation, editTask);
router.patch("/:id/status", taskIdRule, taskStatusRules, handleValidation, changeStatus);
router.delete("/:id", taskIdRule, handleValidation, removeTask);

export default router;