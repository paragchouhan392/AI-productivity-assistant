import { query } from "../config/db.js";

export const findByEmail = async (email) => {
  const { rows } = await query(
    `SELECT user_id AS id, email, user_name, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0];
};

export const findByUserName = async (userName) => {
  const { rows } = await query(
    "SELECT user_id AS id FROM users WHERE user_name = $1",
    [userName]
  );
  return rows[0];
};

export const findById = async (id) => {
  const { rows } = await query(
    `SELECT user_id AS id, email, user_name, created_at
     FROM users
     WHERE user_id = $1`,
    [id]
  );
  return rows[0];
};

export const createUser = async ({ email, userName, passwordHash }) => {
  const { rows } = await query(
    `INSERT INTO users (email, user_name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING user_id AS id, email, user_name, created_at`,
    [email, userName, passwordHash]
  );
  return rows[0];
};