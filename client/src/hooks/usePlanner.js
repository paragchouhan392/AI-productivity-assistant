import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createExtraTodo,
  createPlannedTodo,
  deleteTodo,
  fetchPlannerDay,
  updateTodo,
} from "@/api/planner";

// date = null means "today"
export function usePlannerDay(date) {
  return useQuery({
    queryKey: ["planner", "day", date ?? "today"],
    queryFn: () => fetchPlannerDay(date),
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
}

function usePlannerMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planner"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // for the upcoming dashboard page
    },
  });
}

export const useCreatePlanned = () => usePlannerMutation(createPlannedTodo);
export const useCreateExtra = () => usePlannerMutation(createExtraTodo);
export const useUpdateTodo = () => usePlannerMutation(updateTodo);
export const useDeleteTodo = () => usePlannerMutation(deleteTodo);