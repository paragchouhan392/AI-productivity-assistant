import { query } from "../config/db.js";

// Recalculates one day's row from todo_list (safe to call any number of times)
export const refreshDailyStats = async ({ userId, date }) => {
  await query(
    `INSERT INTO daily_statistics
       (user_id, stat_date, total_alloted_minutes, total_productive_minutes,
        total_task_alloted, total_completed_tasks, partially_completed_tasks,
        pending_tasks, extra_tasks, extra_minutes, updated_at)
     SELECT
       $1::int,
       $2::date,
       COALESCE(SUM(alloted_minutes) FILTER (WHERE NOT is_extra), 0)::int,
       COALESCE(SUM(actual_minutes), 0)::int,
       COUNT(*) FILTER (WHERE NOT is_extra)::int,
       COUNT(*) FILTER (WHERE NOT is_extra AND status = 'completed')::int,
       COUNT(*) FILTER (WHERE NOT is_extra AND status = 'in_progress')::int,
       COUNT(*) FILTER (WHERE NOT is_extra AND status = 'pending')::int,
       COUNT(*) FILTER (WHERE is_extra)::int,
       COALESCE(SUM(actual_minutes) FILTER (WHERE is_extra), 0)::int,
       NOW()
     FROM todo_list
     WHERE user_id = $1 AND todo_date = $2
     ON CONFLICT (user_id, stat_date) DO UPDATE SET
       total_alloted_minutes     = EXCLUDED.total_alloted_minutes,
       total_productive_minutes  = EXCLUDED.total_productive_minutes,
       total_task_alloted        = EXCLUDED.total_task_alloted,
       total_completed_tasks     = EXCLUDED.total_completed_tasks,
       partially_completed_tasks = EXCLUDED.partially_completed_tasks,
       pending_tasks             = EXCLUDED.pending_tasks,
       extra_tasks               = EXCLUDED.extra_tasks,
       extra_minutes             = EXCLUDED.extra_minutes,
       updated_at                = NOW()`,
    [userId, date]
  );
};

export const getStatsRange = async ({ userId, from, to }) => {
  const { rows } = await query(
    `SELECT stat_date, total_alloted_minutes, total_productive_minutes,
            total_task_alloted, total_completed_tasks, partially_completed_tasks,
            pending_tasks, extra_tasks, extra_minutes
     FROM daily_statistics
     WHERE user_id = $1 AND stat_date BETWEEN $2 AND $3
     ORDER BY stat_date ASC`,
    [userId, from, to]
  );
  return rows;
};

export const countNotes = async (userId) => {
  const { rows } = await query(
    "SELECT COUNT(*)::int AS total FROM notes WHERE user_id = $1",
    [userId]
  );
  return rows[0].total;
};