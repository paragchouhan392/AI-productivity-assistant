import { body,  param, query as queryParam, validationResult } from "express-validator";

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