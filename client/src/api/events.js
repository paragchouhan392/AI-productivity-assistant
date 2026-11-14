import api from "./client";

// from/to: "YYYY-MM-DD" (the backend allows ranges of up to 62 days)
export const fetchEventsRange = async ({ from, to }) => {
  const { data } = await api.get("/events", { params: { from, to } });
  return data; // { from, to, events, counts_by_date }
};

export const fetchUpcomingEvents = async ({ days = 7 } = {}) => {
  const { data } = await api.get("/events/upcoming", { params: { days } });
  return data; // { from, to, today_events, events }
};

export const createEvent = async (payload) => {
  const { data } = await api.post("/events", payload);
  return data;
};

export const updateEvent = async ({ id, ...changes }) => {
  const { data } = await api.patch(`/events/${id}`, changes);
  return data;
};

export const deleteEvent = async (id) => {
  const { data } = await api.delete(`/events/${id}`);
  return data;
};