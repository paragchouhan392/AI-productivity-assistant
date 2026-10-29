import { query } from "../config/db.js";
import { DEFAULT_TASK_STATUS } from "../constants/taskStatus.js";

const TZ = process.env.APP_TIMEZONE || "Asia/Kolkata";

const TASK_COLUMNS = `task_id, user_id, task_title, task_description, deadline, status, created_at`;

export const createTask = async ({ userId, title, description, deadline }) => {
  const { rows } = await query(
    `INSERT INTO tasks (user_id, task_title, task_description, deadline, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${TASK_COLUMNS}`,
    [userId, title, description, deadline ?? null, DEFAULT_TASK_STATUS]
  );
  return rows[0];
};

export const getTasksByUser = async ({
  userId,
  status,
  due,
  search,
  sort,
  limit,
  offset,
}) => {
  const params = [userId];
  const conditions = ["user_id = $1"];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(task_title ILIKE $${params.length} OR task_description ILIKE $${params.length})`
    );
  }

  if (due) {
    params.push(TZ);
    const today = `(NOW() AT TIME ZONE $${params.length})::date`;

    if (due === "overdue") {
      conditions.push(`deadline < ${today} AND status <> 'completed'`);
    } else if (due === "today") {
      conditions.push(`deadline = ${today}`);
    } else if (due === "upcoming") {
      conditions.push(`deadline > ${today}`);
    } else if (due === "none") {
      conditions.push("deadline IS NULL");
    }
  }

  const orderBy = {
    deadline: "deadline ASC NULLS LAST, task_id DESC",
    newest: "created_at DESC, task_id DESC",
    oldest: "created_at ASC, task_id ASC",
  }[sort || "deadline"];

  params.push(limit, offset);

  const { rows } = await query(
    `SELECT ${TASK_COLUMNS}, COUNT(*) OVER() AS total_count
     FROM tasks
     WHERE ${conditions.join(" AND ")}
     ORDER BY ${orderBy}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const total = rows.length ? Number(rows[0].total_count) : 0;
  const tasks = rows.map(({ total_count, ...task }) => task);
  return { tasks, total };
};

export const getTaskById = async ({ taskId, userId }) => {
  const { rows } = await query(
    `SELECT ${TASK_COLUMNS} FROM tasks WHERE task_id = $1 AND user_id = $2`,
    [taskId, userId]
  );
  return rows[0];
};

// Only fields that are present in `fields` are updated.
// deadline: null clears the deadline.
const FIELD_MAP = {
  title: "task_title",
  description: "task_description",
  deadline: "deadline",
  status: "status",
};

export const updateTask = async ({ taskId, userId, fields }) => {
  const params = [taskId, userId];
  const sets = [];

  for (const [key, column] of Object.entries(FIELD_MAP)) {
    if (fields[key] !== undefined) {
      params.push(fields[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }

  if (sets.length === 0) return null;

  const { rows } = await query(
    `UPDATE tasks
     SET ${sets.join(", ")}
     WHERE task_id = $1 AND user_id = $2
     RETURNING ${TASK_COLUMNS}`,
    params
  );
  return rows[0];
};

export const deleteTask = async ({ taskId, userId }) => {
  const { rowCount } = await query(
    "DELETE FROM tasks WHERE task_id = $1 AND user_id = $2",
    [taskId, userId]
  );
  return rowCount > 0;
};

export const getTaskStats = async (userId) => {
  const { rows } = await query(
    `WITH today AS (SELECT (NOW() AT TIME ZONE $2)::date AS d)
     SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
       COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
       COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
       COUNT(*) FILTER (
         WHERE status <> 'completed' AND deadline < (SELECT d FROM today)
       )::int AS overdue,
       COUNT(*) FILTER (
         WHERE status <> 'completed'
           AND deadline BETWEEN (SELECT d FROM today) AND (SELECT d FROM today) + 7
       )::int AS due_this_week
     FROM tasks
     WHERE user_id = $1`,
    [userId, TZ]
  );
  return rows[0];
};