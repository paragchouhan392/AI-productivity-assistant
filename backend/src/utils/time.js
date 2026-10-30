// "01:30" -> 90
export const timeToMinutes = (time) => {
  const [hours, minutes] = String(time).split(":").map(Number);
  return hours * 60 + minutes;
};

// 90 -> "01:30" (null stays null)
export const minutesToTime = (totalMinutes) => {
  if (totalMinutes === null || totalMinutes === undefined) return null;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const formatTodo = (row) => ({
  ...row,
  alloted_time: minutesToTime(row.alloted_minutes),
  actual_time: minutesToTime(row.actual_minutes),
});