// Works on "YYYY-MM-DD" strings so timezones can never shift the day
export const addDays = (dateStr, days) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

const toLocalDate = (dateStr) => new Date(`${dateStr}T00:00:00`);

export const formatLongDate = (dateStr) =>
  toLocalDate(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const dayLabel = (dateStr, today) => {
  if (dateStr === today) return "Today";
  if (dateStr === addDays(today, 1)) return "Tomorrow";
  if (dateStr === addDays(today, -1)) return "Yesterday";
  return toLocalDate(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};