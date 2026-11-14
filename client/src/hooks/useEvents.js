import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  fetchEventsRange,
  fetchUpcomingEvents,
  updateEvent,
} from "@/api/events";

export function useEventsRange(from, to) {
  return useQuery({
    queryKey: ["events", "range", from, to],
    queryFn: () => fetchEventsRange({ from, to }),
    placeholderData: keepPreviousData,
  });
}

export function useUpcomingEvents(days = 7) {
  return useQuery({
    queryKey: ["events", "upcoming", days],
    queryFn: () => fetchUpcomingEvents({ days }),
    refetchOnWindowFocus: true,
  });
}

function useEventsMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // for the upcoming dashboard page
    },
  });
}

export const useCreateEvent = () => useEventsMutation(createEvent);
export const useUpdateEvent = () => useEventsMutation(updateEvent);
export const useDeleteEvent = () => useEventsMutation(deleteEvent);