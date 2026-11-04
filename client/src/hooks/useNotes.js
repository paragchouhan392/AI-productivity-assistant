import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes, updateNote } from "@/api/notes";

const PAGE_SIZE = 24;

export function useNotesList(search) {
  return useInfiniteQuery({
    queryKey: ["notes", { search }],
    queryFn: ({ pageParam }) =>
      fetchNotes({ page: pageParam, limit: PAGE_SIZE, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    placeholderData: keepPreviousData,
  });
}

function useNotesMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export const useCreateNote = () => useNotesMutation(createNote);
export const useUpdateNote = () => useNotesMutation(updateNote);
export const useDeleteNote = () => useNotesMutation(deleteNote);