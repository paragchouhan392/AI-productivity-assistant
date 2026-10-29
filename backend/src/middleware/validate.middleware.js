import { body,  param, query as queryParam, validationResult } from "express-validator";
import { TASK_STATUSES } from "../constants/taskStatus.js";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

//validation rules for the authentication

export const registerRules = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("user_name")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscores"),
  body("password")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be 8-72 characters")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain a letter")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

export const loginRules = [
  body("email").trim().toLowerCase().isEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

//validation rules for the notes

export const noteIdRule = [
  param("id")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("Invalid note id")
    .toInt(),
];

export const createNoteRules = [
  body("note_title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title is required (max 200 characters)"),
  body("note_description")
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be text")
    .isLength({ max: 10000 })
    .withMessage("Description can be at most 10000 characters"),
];

export const updateNoteRules = [
  body("note_title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be 1-200 characters"),
  body("note_description")
    .optional()
    .isString()
    .withMessage("Description must be text")
    .isLength({ max: 10000 })
    .withMessage("Description can be at most 10000 characters"),
  body().custom((value, { req }) => {
    if (
      req.body.note_title === undefined &&
      req.body.note_description === undefined
    ) {
      throw new Error("Provide note_title or note_description to update");
    }
    return true;
  }),
];

export const listNotesRules = [
  queryParam("page").optional().isInt({ min: 1 }).withMessage("page must be 1 or more").toInt(),
  queryParam("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100").toInt(),
  queryParam("search").optional().isString().trim().isLength({ max: 100 }),
];

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export const taskIdRule = [
  param("id")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("Invalid task id")
    .toInt(),
];

export const createTaskRules = [
  body("task_title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title is required (max 200 characters)"),
  body("task_description")
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be text")
    .isLength({ max: 5000 })
    .withMessage("Description can be at most 5000 characters"),
  body("deadline")
    .optional({ values: "null" })
    .matches(DATE_ONLY)
    .withMessage("Deadline must be in YYYY-MM-DD format")
    .isISO8601({ strict: true })
    .withMessage("Deadline is not a valid date"),
];

export const updateTaskRules = [
  body("task_title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be 1-200 characters"),
  body("task_description")
    .optional()
    .isString()
    .withMessage("Description must be text")
    .isLength({ max: 5000 })
    .withMessage("Description can be at most 5000 characters"),
  body("deadline")
    .optional({ values: "null" })
    .matches(DATE_ONLY)
    .withMessage("Deadline must be in YYYY-MM-DD format, or null to remove it")
    .isISO8601({ strict: true })
    .withMessage("Deadline is not a valid date"),
  body("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(", ")}`),
  body().custom((value, { req }) => {
    const allowed = ["task_title", "task_description", "deadline", "status"];
    if (!allowed.some((key) => req.body[key] !== undefined)) {
      throw new Error("Provide at least one field to update");
    }
    return true;
  }),
];

export const taskStatusRules = [
  body("status")
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(", ")}`),
];

export const listTasksRules = [
  queryParam("page").optional().isInt({ min: 1 }).withMessage("page must be 1 or more").toInt(),
  queryParam("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100").toInt(),
  queryParam("status").optional().isIn(TASK_STATUSES).withMessage("Invalid status"),
  queryParam("due")
    .optional()
    .isIn(["overdue", "today", "upcoming", "none"])
    .withMessage("due must be overdue, today, upcoming or none"),
  queryParam("sort")
    .optional()
    .isIn(["deadline", "newest", "oldest"])
    .withMessage("sort must be deadline, newest or oldest"),
  queryParam("search").optional().isString().trim().isLength({ max: 100 }),
];