import { query } from "../config/db.js";
import { DEFAULT_EVENT_TYPE } from "../constants/eventTypes.js";

const COLUMNS = `event_id, user_id, event_title, event_description, event_date,
                 event_time, event_type, created_at, updated_at`;

export const createEvent = async ({ userId, title, description, date, time, type }) => {
  const { rows } = await query(
    `INSERT INTO events
       (user_id, event_title, event_description, event_date, event_time, event_type)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${COLUMNS}`,
    [userId, title, description, date, time ?? null, type || DEFAULT_EVENT_TYPE]
  );
  return rows[0];
};

// All-day events (no time) come first, then timed events in order
export const getEventsInRange = async ({ userId, from, to, type }) => {
  const params = [userId, from, to];
  let typeFilter = "";

  if (type) {
    params.push(type);
    typeFilter = `AND event_type = $${params.length}`;
  }

  const { rows } = await query(
    `SELECT ${COLUMNS}
     FROM events
     WHERE user_id = $1
       AND event_date BETWEEN $2 AND $3
       ${typeFilter}
     ORDER BY event_date ASC, event_time ASC NULLS FIRST, event_id ASC`,
    params
  );
  return rows;
};

export const getEventById = async ({ eventId, userId }) => {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM events WHERE event_id = $1 AND user_id = $2`,
    [eventId, userId]
  );
  return rows[0];
};

const FIELD_MAP = {
  title: "event_title",
  description: "event_description",
  date: "event_date",
  time: "event_time",
  type: "event_type",
};

// Only fields that are present are updated (time: null clears the time)
export const updateEvent = async ({ eventId, userId, fields }) => {
  const params = [eventId, userId];
  const sets = [];

  for (const [key, column] of Object.entries(FIELD_MAP)) {
    if (fields[key] !== undefined) {
      params.push(fields[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }

  if (sets.length === 0) return null;

  sets.push("updated_at = NOW()");

  const { rows } = await query(
    `UPDATE events
     SET ${sets.join(", ")}
     WHERE event_id = $1 AND user_id = $2
     RETURNING ${COLUMNS}`,
    params
  );
  return rows[0];
};

export const deleteEvent = async ({ eventId, userId }) => {
  const { rowCount } = await query(
    "DELETE FROM events WHERE event_id = $1 AND user_id = $2",
    [eventId, userId]
  );
  return rowCount > 0;
};