import { addDays, daysBetween } from "./date";

// 0 = Sunday, 1 = Monday
export const WEEK_STARTS_ON = 0;

const pad = (n) => String(n).padStart(2, "0");

const toUtc = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

// "2026-11-14" -> "2026-11-01"
export const firstOfMonth = (dateStr) => `${dateStr.slice(0, 7)}-01`;

// monthStart = "YYYY-MM-01"
export const addMonths = (monthStart, delta) => {
  const d = toUtc(monthStart);
  d.setUTCMonth(d.getUTCMonth() + delta, 1);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-01`;
};

export const weekdayOf = (dateStr) => toUtc(dateStr).getUTCDay();

// Always 6 full weeks (42 days), so the grid never changes height
export const buildMonthGrid = (monthStart) => {
  const offset = (weekdayOf(monthStart) - WEEK_STARTS_ON + 7) % 7;
  const gridStart = addDays(monthStart, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
};

export const weekdayLabels = () =>
  Array.from({ length: 7 }, (_, i) => {
    const day = (WEEK_STARTS_ON + i) % 7;
    // 1 Jan 2023 was a Sunday
    return new Date(Date.UTC(2023, 0, 1 + day)).toLocaleDateString(undefined, {
      weekday: "short",
      timeZone: "UTC",
    });
  });

export const monthTitle = (monthStart) =>
  toUtc(monthStart).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const dayHeading = (dateStr) => {
  const d = toUtc(dateStr);
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "long", timeZone: "UTC" }),
    dayMonth: d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
};

export const relativeDay = (dateStr, today) => {
  const diff = daysBetween(today, dateStr);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
};