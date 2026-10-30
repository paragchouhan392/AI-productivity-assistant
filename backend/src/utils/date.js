const TZ = process.env.APP_TIMEZONE || "Asia/Kolkata";

// Returns "YYYY-MM-DD" for the current date in the app timezone
export const getToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());

export const addDays = (dateStr, days) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

export const daysBetween = (fromStr, toStr) => {
  const toUtc = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(toStr) - toUtc(fromStr)) / 86400000);
};