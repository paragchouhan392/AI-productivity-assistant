import api from "./client";

// date omitted = today (as decided by the server)
export const fetchPlannerDay = async (date) => {
  const { data } = await api.get("/planner", { params: { date: date || undefined } });
  return data; // { date, can_edit, planned_tasks, extra_tasks, summary }
};

export const createPlannedTodo = async (payload) => {
  const { data } = await api.post("/planner", payload);
  return data;
};

export const createExtraTodo = async (payload) => {
  const { data } = await api.post("/planner/extra", payload);
  return data;
};

export const updateTodo = async ({ id, ...changes }) => {
  const { data } = await api.patch(`/planner/${id}`, changes);
  return data;
};

export const deleteTodo = async (id) => {
  const { data } = await api.delete(`/planner/${id}`);
  return data;
};