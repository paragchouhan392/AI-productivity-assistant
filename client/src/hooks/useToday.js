import { usePlannerDay } from "./usePlanner";

const browserToday = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

export default function useToday() {
  const { data } = usePlannerDay(null);
  return data?.date ?? browserToday();
}