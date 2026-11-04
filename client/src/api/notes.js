import api from "./client";

export const fetchNotes = async ({ page = 1, limit = 24, search = "" }) => {
  const { data } = await api.get("/notes", {
    params: { page, limit, search: search || undefined },
  });
  return data; // { notes, pagination: { page, limit, total, totalPages } }
};

export const createNote = async (payload) => {
  const { data } = await api.post("/notes", payload);
  return data;
};

export const updateNote = async ({ id, ...changes }) => {
  const { data } = await api.patch(`/notes/${id}`, changes);
  return data;
};

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};