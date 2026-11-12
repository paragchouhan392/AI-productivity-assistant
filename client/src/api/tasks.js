import api from "./client";

export const fetchTasks = async ({
  page = 1,
  limit = 20,
  status,
  due,
  sort,
  search,
}) => {
  const { data } = await api.get("/tasks", {
    params: {
      page,
      limit,
      status: status || undefined,
      due: due || undefined,
      sort: sort || undefined,
      search: search || undefined,
    },
  });
  return data; // { tasks, pagination: { page, limit, total, totalPages } }
};

export const fetchTaskStats = async () => {
  const { data } = await api.get("/tasks/stats");
  return data.stats;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data;
};

export const updateTask = async ({ id, ...changes }) => {
  const { data } = await api.patch(`/tasks/${id}`, changes);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};