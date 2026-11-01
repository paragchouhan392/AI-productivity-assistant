import { getStatsRange, refreshDailyStats, countNotes } from "../models/stats.model.js";
import { getTaskStats } from "../models/task.model.js";
import { getEventsInRange } from "../models/event.model.js";
import { getToday, addDays, daysBetween, eachDate } from "../utils/date.js";
import { minutesToTime } from "../utils/time.js";

const MAX_HEATMAP_DAYS = 366;

const percentage = (part, whole) => (whole === 0 ? 0 : Math.round((part / whole) * 100));

// 0 = no activity ... 4 = most productive
const heatLevel = (minutes) => {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 90) return 2;
  if (minutes < 180) return 3;
  return 4;
};

// One day in a consistent shape (zeros when no row exists)
const dayShape = (date, row) => ({
  date,
  alloted_minutes: row?.total_alloted_minutes ?? 0,
  productive_minutes: row?.total_productive_minutes ?? 0,
  planned_tasks: row?.total_task_alloted ?? 0,
  completed_tasks: row?.total_completed_tasks ?? 0,
  partially_completed_tasks: row?.partially_completed_tasks ?? 0,
  pending_tasks: row?.pending_tasks ?? 0,
  extra_tasks: row?.extra_tasks ?? 0,
  extra_minutes: row?.extra_minutes ?? 0,
  completion_rate: percentage(row?.total_completed_tasks ?? 0, row?.total_task_alloted ?? 0),
});

const buildTotals = (days) => {
  const sum = (key) => days.reduce((total, day) => total + day[key], 0);

  const planned = sum("planned_tasks");
  const completed = sum("completed_tasks");
  const allotted = sum("alloted_minutes");
  const productive = sum("productive_minutes");
  const plannedActual = productive - sum("extra_minutes");
  const activeDays = days.filter((d) => d.productive_minutes > 0);

  const bestDay = activeDays.reduce(
    (best, day) => (!best || day.productive_minutes > best.productive_minutes ? day : best),
    null
  );

  return {
    planned_tasks: planned,
    completed_tasks: completed,
    partially_completed_tasks: sum("partially_completed_tasks"),
    pending_tasks: sum("pending_tasks"),
    extra_tasks: sum("extra_tasks"),
    completion_rate: percentage(completed, planned),
    alloted_minutes: allotted,
    alloted_time: minutesToTime(allotted),
    productive_minutes: productive,
    productive_time: minutesToTime(productive),
    // planned work time vs allotted time (can exceed 100%)
    time_utilization_percentage: percentage(plannedActual, allotted),
    active_days: activeDays.length,
    avg_productive_minutes_per_active_day:
      activeDays.length === 0 ? 0 : Math.round(productive / activeDays.length),
    best_day: bestDay ? { date: bestDay.date, productive_minutes: bestDay.productive_minutes } : null,
  };
};

// A day counts as active if any time was logged
const calculateStreaks = (rows, today) => {
  const active = new Set(
    rows.filter((r) => r.total_productive_minutes > 0).map((r) => r.stat_date)
  );

  // If today has nothing logged yet, the streak continues from yesterday
  let current = 0;
  let cursor = active.has(today) ? today : addDays(today, -1);
  while (active.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  let longest = 0;
  let run = 0;
  let previous = null;
  for (const date of [...active].sort()) {
    run = previous && daysBetween(previous, date) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }

  return { current, longest };
};

// Cards at the top of the dashboard
export const overview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = getToday();

    // Makes sure today's numbers are fresh
    await refreshDailyStats({ userId, date: today });

    const yearStart = addDays(today, -364);
    const weekStart = addDays(today, -6);

    const [rows, taskStats, upcomingEvents, notesTotal] = await Promise.all([
      getStatsRange({ userId, from: yearStart, to: today }),
      getTaskStats(userId),
      getEventsInRange({ userId, from: today, to: addDays(today, 7) }),
      countNotes(userId),
    ]);

    const byDate = new Map(rows.map((r) => [r.stat_date, r]));
    const weekDays = eachDate(weekStart, today).map((d) => dayShape(d, byDate.get(d)));

    res.json({
      today: {
        ...dayShape(today, byDate.get(today)),
        productive_time: minutesToTime(byDate.get(today)?.total_productive_minutes ?? 0),
        alloted_time: minutesToTime(byDate.get(today)?.total_alloted_minutes ?? 0),
      },
      streak: calculateStreaks(rows, today),
      this_week: buildTotals(weekDays),
      tasks: {
        ...taskStats,
        completion_percentage: percentage(taskStats.completed, taskStats.total),
      },
      events: {
        today_count: upcomingEvents.filter((e) => e.event_date === today).length,
        next_7_days_count: upcomingEvents.length,
      },
      notes: { total: notesTotal },
    });
  } catch (err) {
    next(err);
  }
};

// Heatmap: only days with activity are returned (missing days = no activity)
// Default: last 365 days. For a calendar year use ?from=2026-01-01&to=2026-12-31
export const heatmap = async (req, res, next) => {
  try {
    const { from: fromQuery, to: toQuery } = req.query;

    if (Boolean(fromQuery) !== Boolean(toQuery)) {
      return res.status(400).json({ message: "Provide both from and to" });
    }

    const to = toQuery || getToday();
    const from = fromQuery || addDays(to, -364);

    if (from > to) {
      return res.status(400).json({ message: "from must be before or equal to to" });
    }
    if (daysBetween(from, to) + 1 > MAX_HEATMAP_DAYS) {
      return res.status(400).json({
        message: `Date range can be at most ${MAX_HEATMAP_DAYS} days`,
      });
    }

    const rows = await getStatsRange({ userId: req.user.id, from, to });

    const days = rows
      .filter((r) => r.total_productive_minutes > 0 || r.total_completed_tasks > 0)
      .map((r) => ({
        date: r.stat_date,
        productive_minutes: r.total_productive_minutes,
        completed_tasks: r.total_completed_tasks,
        planned_tasks: r.total_task_alloted,
        level: heatLevel(r.total_productive_minutes),
      }));

    res.json({
      from,
      to,
      levels: { 0: "none", 1: "< 30 min", 2: "30-89 min", 3: "90-179 min", 4: "180+ min" },
      days,
    });
  } catch (err) {
    next(err);
  }
};

// Daily series for line/bar charts (every date is present, zeros included)
export const trends = async (req, res, next) => {
  try {
    const range = req.query.range || 7;
    const to = getToday();
    const from = addDays(to, -(range - 1));

    const rows = await getStatsRange({ userId: req.user.id, from, to });
    const byDate = new Map(rows.map((r) => [r.stat_date, r]));

    const series = eachDate(from, to).map((d) => dayShape(d, byDate.get(d)));

    res.json({ range, from, to, series, totals: buildTotals(series) });
  } catch (err) {
    next(err);
  }
};