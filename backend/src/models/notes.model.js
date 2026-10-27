import { query } from "../config/db.js";

export const createNote = async ({ userId, title, description }) => {
  const { rows } = await query(
    `INSERT INTO notes (user_id, note_title, note_description)
     VALUES ($1, $2, $3)
     RETURNING note_id, user_id, note_title, note_description`,
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
    `SELECT note_id, user_id, note_title, note_description,
            COUNT(*) OVER() AS total_count
     FROM notes
     ${where}
     ORDER BY note_id DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const total = rows.length ? Number(rows[0].total_count) : 0;
  const notes = rows.map(({ total_count, ...note }) => note);
  return { notes, total };
};

export const getNoteById = async ({ noteId, userId }) => {
  const { rows } = await query(
    `SELECT note_id, user_id, note_title, note_description
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
         note_description = COALESCE($4, note_description)
     WHERE note_id = $1 AND user_id = $2
     RETURNING note_id, user_id, note_title, note_description`,
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