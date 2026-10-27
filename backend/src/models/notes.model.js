import { query } from "../config/db.js";

const NOTE_COLUMNS = `note_id, user_id, note_title, note_description, created_at, updated_at`;

export const createNote = async ({ userId, title, description }) => {
  const { rows } = await query(
    `INSERT INTO notes (user_id, note_title, note_description)
     VALUES ($1, $2, $3)
     RETURNING ${NOTE_COLUMNS}`,
    [userId, title, description]
  );
  return rows[0];
};

export const getNotesByUser = async ({ userId, search, limit, offset }) => {
  const params = [userId];
  let where = "WHERE user_id = $1";

  if (search) {
    params.push(`%${search}%`);
    where += ` AND (note_title ILIKE $${params.length}
                 OR note_description ILIKE $${params.length})`;
  }

  params.push(limit, offset);

  const { rows } = await query(
    `SELECT ${NOTE_COLUMNS}, COUNT(*) OVER() AS total_count
     FROM notes
     ${where}
     ORDER BY updated_at DESC, note_id DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const total = rows.length ? Number(rows[0].total_count) : 0;
  const notes = rows.map(({ total_count, ...note }) => note);
  return { notes, total };
};

export const getNoteById = async ({ noteId, userId }) => {
  const { rows } = await query(
    `SELECT ${NOTE_COLUMNS}
     FROM notes
     WHERE note_id = $1 AND user_id = $2`,
    [noteId, userId]
  );
  return rows[0];
};

export const updateNote = async ({ noteId, userId, title, description }) => {
  const { rows } = await query(
    `UPDATE notes
     SET note_title = COALESCE($3, note_title),
         note_description = COALESCE($4, note_description),
         updated_at = NOW()
     WHERE note_id = $1 AND user_id = $2
     RETURNING ${NOTE_COLUMNS}`,
    [noteId, userId, title ?? null, description ?? null]
  );
  return rows[0];
};

export const deleteNote = async ({ noteId, userId }) => {
  const { rowCount } = await query(
    "DELETE FROM notes WHERE note_id = $1 AND user_id = $2",
    [noteId, userId]
  );
  return rowCount > 0;
};