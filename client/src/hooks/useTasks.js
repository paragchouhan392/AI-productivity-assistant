import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  fetchTaskStats,
  fetchTasks,
  updateTask,
} from "@/api/tasks";

const PAGE_SIZE = 20;

// filters = { status, due, sort, search }
export function useTasksList(filters) {
  return useInfiniteQuery({
    queryKey: ["tasks", "list", filters],
    queryFn: ({ pageParam }) =>
      fetchTasks({ ...filters, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useTaskStats() {
  return useQuery({ queryKey: ["tasks", "stats"], queryFn: fetchTaskStats });
}

function useTasksMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // list + stats
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // for the upcoming dashboard page
    },
  });
}

export const useCreateTask = () => useTasksMutation(createTask);
export const useUpdateTask = () => useTasksMutation(updateTask);
export const useDeleteTask = () => useTasksMutation(deleteTask);