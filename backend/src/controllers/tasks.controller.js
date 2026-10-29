import {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../models/task.model.js";

export const addTask = async (req, res, next) => {
  try {
    const { task_title, task_description, deadline } = req.body;

    const task = await createTask({
      userId: req.user.id,
      title: task_title,
      description: task_description ?? "",
      deadline,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    next(err);
  }
};

export const listTasks = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 50;

    const { tasks, total } = await getTasksByUser({
      userId: req.user.id,
      status: req.query.status,
      due: req.query.due,
      search: req.query.search,
      sort: req.query.sort,
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      tasks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await getTaskById({
      taskId: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const editTask = async (req, res, next) => {
  try {
    const { task_title, task_description, deadline, status } = req.body;

    const task = await updateTask({
      taskId: req.params.id,
      userId: req.user.id,
      fields: {
        title: task_title,
        description: task_description,
        deadline,
        status,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated", task });
  } catch (err) {
    next(err);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const task = await updateTask({
      taskId: req.params.id,
      userId: req.user.id,
      fields: { status: req.body.status },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Status updated", task });
  } catch (err) {
    next(err);
  }
};

export const removeTask = async (req, res, next) => {
  try {
    const deleted = await deleteTask({
      taskId: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

export const taskStats = async (req, res, next) => {
  try {
    const stats = await getTaskStats(req.user.id);

    const completionPercentage =
      stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

    res.json({ stats: { ...stats, completion_percentage: completionPercentage } });
  } catch (err) {
    next(err);
  }
};