import { query } from "../config/db.js";

const COLUMNS = `daily_task_id, user_id, todo_title, todo_description, todo_date,
                 alloted_minutes, actual_minutes, status, is_extra`;

export const createTodo = async ({
  userId,
  title,
  description,
  date,
  allotedMinutes,
  actualMinutes,
  status,
  isExtra,
}) => {
  const { rows } = await query(
    `INSERT INTO todo_list
       (user_id, todo_title, todo_description, todo_date,
        alloted_minutes, actual_minutes, status, is_extra)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${COLUMNS}`,
    [userId, title, description, date, allotedMinutes, actualMinutes, status, isExtra]
  );
  return rows[0];
};

export const getTodosByDate = async ({ userId, date }) => {
  const { rows } = await query(
    `SELECT ${COLUMNS}
     FROM todo_list
     WHERE user_id = $1 AND todo_date = $2
     ORDER BY is_extra ASC, daily_task_id ASC`,
    [userId, date]
  );
  return rows;
};

export const getTodoById = async ({ todoId, userId }) => {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM todo_list WHERE daily_task_id = $1 AND user_id = $2`,
    [todoId, userId]
  );
  return rows[0];
};

const FIELD_MAP = {
  title: "todo_title",
  description: "todo_description",
  allotedMinutes: "alloted_minutes",
  actualMinutes: "actual_minutes",
  status: "status",
};

// Only fields that are present are updated (allotedMinutes: null clears it)
export const updateTodo = async ({ todoId, userId, fields }) => {
  const params = [todoId, userId];
  const sets = [];

  for (const [key, column] of Object.entries(FIELD_MAP)) {
    if (fields[key] !== undefined) {
      params.push(fields[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }

  if (sets.length === 0) return null;

  const { rows } = await query(
    `UPDATE todo_list
     SET ${sets.join(", ")}
     WHERE daily_task_id = $1 AND user_id = $2
     RETURNING ${COLUMNS}`,
    params
  );
  return rows[0];
};

export const deleteTodo = async ({ todoId, userId }) => {
  const { rowCount } = await query(
    "DELETE FROM todo_list WHERE daily_task_id = $1 AND user_id = $2",
    [todoId, userId]
  );
  return rowCount > 0;
};

export const getDailyHistory = async ({ userId, from, to }) => {
  const { rows } = await query(
    `SELECT
       todo_date,
       COUNT(*) FILTER (WHERE NOT is_extra)::int AS planned_count,
       COUNT(*) FILTER (WHERE NOT is_extra AND status = 'completed')::int AS planned_completed,
       COUNT(*) FILTER (WHERE is_extra)::int AS extra_count,
       COALESCE(SUM(alloted_minutes) FILTER (WHERE NOT is_extra), 0)::int AS planned_alloted_minutes,
       COALESCE(SUM(actual_minutes), 0)::int AS total_actual_minutes
     FROM todo_list
     WHERE user_id = $1 AND todo_date BETWEEN $2 AND $3
     GROUP BY todo_date
     ORDER BY todo_date DESC`,
    [userId, from, to]
  );
  return rows;
};