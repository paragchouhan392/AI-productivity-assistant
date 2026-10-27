import {
  createNote,
  getNotesByUser,
  getNoteById,
  updateNote,
  deleteNote,
} from "../models/note.model.js";

export const addNote = async (req, res, next) => {
  try {
    const { note_title, note_description } = req.body;

    const note = await createNote({
      userId: req.user.id,
      title: note_title,
      description: note_description ?? "",
    });

    res.status(201).json({ message: "Note created", note });
  } catch (err) {
    next(err);
  }
};

export const listNotes = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const search = req.query.search || "";

    const { notes, total } = await getNotesByUser({
      userId: req.user.id,
      search,
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getNote = async (req, res, next) => {
  try {
    const note = await getNoteById({
      noteId: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

export const editNote = async (req, res, next) => {
  try {
    const { note_title, note_description } = req.body;

    const note = await updateNote({
      noteId: req.params.id,
      userId: req.user.id,
      title: note_title,
      description: note_description,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated", note });
  } catch (err) {
    next(err);
  }
};

export const removeNote = async (req, res, next) => {
  try {
    const deleted = await deleteNote({
      noteId: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};