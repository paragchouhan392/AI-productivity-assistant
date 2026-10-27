import { Router } from "express";
import {
  addNote,
  listNotes,
  getNote,
  editNote,
  removeNote,
} from "../controllers/notes.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  handleValidation,
  noteIdRule,
  createNoteRules,
  updateNoteRules,
  listNotesRules,
} from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);

router.get("/", listNotesRules, handleValidation, listNotes);
router.post("/", createNoteRules, handleValidation, addNote);

router.get("/:id", noteIdRule, handleValidation, getNote);
router.patch("/:id", noteIdRule, updateNoteRules, handleValidation, editNote);
router.delete("/:id", noteIdRule, handleValidation, removeNote);

export default router;