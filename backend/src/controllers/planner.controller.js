import {
  createTodo,
  getTodosByDate,
  getTodoById,
  updateTodo,
  deleteTodo,
  getDailyHistory,
} from "../models/planner.model.js";
import { getToday, addDays, daysBetween } from "../utils/date.js";
import { timeToMinutes, minutesToTime, formatTodo } from "../utils/time.js";

const sum = (items, key) => items.reduce((total, item) => total + (item[key] ?? 0), 0);

const buildSummary = (todos) => {
  const planned = todos.filter((t) => !t.is_extra);
  const extra = todos.filter((t) => t.is_extra);
  const completed = planned.filter((t) => t.status === "completed").length;

  const plannedAlloted = sum(planned, "alloted_minutes");
  const plannedActual = sum(planned, "actual_minutes");
  const extraActual = sum(extra, "actual_minutes");

  return {
    planned_count: planned.length,
    planned_completed: completed,
    planned_completion_percentage:
      planned.length === 0 ? 0 : Math.round((completed / planned.length) * 100),
    extra_count: extra.length,
    planned_alloted_minutes: plannedAlloted,
    planned_alloted_time: minutesToTime(plannedAlloted),
    planned_actual_minutes: plannedActual,
    planned_actual_time: minutesToTime(plannedActual),
    extra_actual_minutes: extraActual,
    extra_actual_time: minutesToTime(extraActual),
    total_actual_minutes: plannedActual + extraActual,
    total_actual_time: minutesToTime(plannedActual + extraActual),
  };
};

// Plan a task for today or tomorrow
export const addPlannedTodo = async (req, res, next) => {
  try {
    const { todo_title, todo_description, todo_date, alloted_time } = req.body;

    const today = getToday();
    const date = todo_date || today;

    if (date !== today && date !== addDays(today, 1)) {
      return res.status(400).json({
        message:
          "The daily planner only accepts today or tomorrow. Use Tasks for later dates.",
      });
    }

    const todo = await createTodo({
      userId: req.user.id,
      title: todo_title,
      description: todo_description ?? "",
      date,
      allotedMinutes: timeToMinutes(alloted_time),
      actualMinutes: 0,
      status: "pending",
      isExtra: false,
    });

    res.status(201).json({ message: "Task added to planner", todo: formatTodo(todo) });
  } catch (err) {
    next(err);
  }
};

// Add something done today that was not planned
export const addExtraTodo = async (req, res, next) => {
  try {
    const { todo_title, todo_description, actual_time, alloted_time } = req.body;

    const todo = await createTodo({
      userId: req.user.id,
      title: todo_title,
      description: todo_description ?? "",
      date: getToday(),
      allotedMinutes: alloted_time ? timeToMinutes(alloted_time) : null,
      actualMinutes: timeToMinutes(actual_time),
      status: "completed",
      isExtra: true,
    });

    res.status(201).json({ message: "Extra task added", todo: formatTodo(todo) });
  } catch (err) {
    next(err);
  }
};

// All tasks of one day (defaults to today) + summary
export const listTodos = async (req, res, next) => {
  try {
    const today = getToday();
    const date = req.query.date || today;

    const todos = (await getTodosByDate({ userId: req.user.id, date })).map(formatTodo);

    res.json({
      date,
      can_edit: date >= today,
      planned_tasks: todos.filter((t) => !t.is_extra),
      extra_tasks: todos.filter((t) => t.is_extra),
      summary: buildSummary(todos),
    });
  } catch (err) {
    next(err);
  }
};

export const getTodo = async (req, res, next) => {
  try {
    const todo = await getTodoById({ todoId: req.params.id, userId: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ todo: formatTodo(todo) });
  } catch (err) {
    next(err);
  }
};

export const editTodo = async (req, res, next) => {
  try {
    const existing = await getTodoById({ todoId: req.params.id, userId: req.user.id });
    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    const today = getToday();
    const { todo_title, todo_description, alloted_time, actual_time, status } = req.body;

    if (existing.todo_date < today) {
      return res.status(403).json({ message: "Tasks from past days are read-only" });
    }

    if (existing.todo_date > today && (actual_time !== undefined || status !== undefined)) {
      return res.status(400).json({
        message: "Time and status can only be updated on the day of the task",
      });
    }

    if (alloted_time === null && !existing.is_extra) {
      return res.status(400).json({ message: "Planned tasks must have an allotted time" });
    }

    if (existing.is_extra && status !== undefined && status !== "completed") {
      return res.status(400).json({ message: "Extra tasks are always completed" });
    }

    const actualMinutes = actual_time !== undefined ? timeToMinutes(actual_time) : undefined;
    const finalActual = actualMinutes ?? existing.actual_minutes;
    const finalStatus = status ?? existing.status;

    if (finalStatus === "completed" && finalActual === 0) {
      return res.status(400).json({
        message: "Enter the actual time spent before marking a task as completed",
      });
    }

    const todo = await updateTodo({
      todoId: req.params.id,
      userId: req.user.id,
      fields: {
        title: todo_title,
        description: todo_description,
        allotedMinutes:
          alloted_time === undefined
            ? undefined
            : alloted_time === null
            ? null
            : timeToMinutes(alloted_time),
        actualMinutes,
        status,
      },
    });

    res.json({ message: "Task updated", todo: formatTodo(todo) });
  } catch (err) {
    next(err);
  }
};

export const removeTodo = async (req, res, next) => {
  try {
    const existing = await getTodoById({ todoId: req.params.id, userId: req.user.id });
    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (existing.todo_date < getToday()) {
      return res.status(403).json({ message: "Tasks from past days are read-only" });
    }

    await deleteTodo({ todoId: req.params.id, userId: req.user.id });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

// Per-day totals for a date range (default: last 7 days)
export const history = async (req, res, next) => {
  try {
    const today = getToday();
    const to = req.query.to || today;
    const from = req.query.from || addDays(to, -6);

    if (from > to) {
      return res.status(400).json({ message: "from must be before or equal to to" });
    }
    if (daysBetween(from, to) > 31) {
      return res.status(400).json({ message: "Date range can be at most 31 days" });
    }

    const rows = await getDailyHistory({ userId: req.user.id, from, to });

    const days = rows.map((row) => ({
      ...row,
      planned_alloted_time: minutesToTime(row.planned_alloted_minutes),
      total_actual_time: minutesToTime(row.total_actual_minutes),
      planned_completion_percentage:
        row.planned_count === 0
          ? 0
          : Math.round((row.planned_completed / row.planned_count) * 100),
    }));

    res.json({ from, to, days });
  } catch (err) {
    next(err);
  }
};