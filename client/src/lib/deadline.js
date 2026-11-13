import { daysBetween, formatShortDate } from "./date";

// Returns { label, tone } for a deadline, or null when there isn't one
export function describeDeadline(deadline, today, completed = false) {
  if (!deadline) return null;

  if (completed) {
    return { label: `Due ${formatShortDate(deadline, today)}`, tone: "slate" };
  }

  const diff = daysBetween(today, deadline);
  if (diff < 0) {
    return { label: `Overdue by ${-diff} day${diff === -1 ? "" : "s"}`, tone: "red" };
  }
  if (diff === 0) return { label: "Due today", tone: "amber" };
  if (diff === 1) return { label: "Due tomorrow", tone: "amber" };
  if (diff <= 7) return { label: `Due in ${diff} days`, tone: "blue" };
  return { label: `Due ${formatShortDate(deadline, today)}`, tone: "slate" };
}