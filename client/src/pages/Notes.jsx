import { useEffect, useState } from "react";
import { Plus, Search, StickyNote, X } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import { useDeleteNote, useNotesList } from "@/hooks/useNotes";
import useDebounce from "@/hooks/useDebounce";
import NoteCard from "@/components/notes/NoteCard";
import NoteEditorModal from "@/components/notes/NoteEditorModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

function NotesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="min-h-44 animate-pulse rounded-2xl border border-white/5 bg-surface p-5"
        >
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="mt-4 space-y-2">
            <div className="h-3 rounded bg-white/5" />
            <div className="h-3 w-5/6 rounded bg-white/5" />
            <div className="h-3 w-3/4 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ searching, query, onCreate, onClear }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
        <StickyNote size={26} />
      </div>
      {searching ? (
        <>
          <h2 className="mt-5 text-lg font-semibold">
            No notes match “{query}”
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            Try a different word, or clear the search to see everything.
          </p>
          <button
            onClick={onClear}
            className="mt-6 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
          >
            Clear search
          </button>
        </>
      ) : (
        <>
          <h2 className="mt-5 text-lg font-semibold">Your notes live here</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Ideas, study notes, plans. Write the first one and it will show up
            here.
          </p>
          <button
            onClick={onCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            <Plus size={16} />
            Write your first note
          </button>
        </>
      )}
    </div>
  );
}

export default function Notes() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 350);

  const [editing, setEditing] = useState(null); // a note, "new", or null
  const [deleting, setDeleting] = useState(null); // a note or null

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = useNotesList(search);
  const deleteMutation = useDeleteNote();

  const notes = data?.pages.flatMap((page) => page.notes) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;

  // Press "N" to start a new note (when not typing somewhere)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey)
        return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
        return;
      if (editing || deleting) return;
      e.preventDefault();
      setEditing("new");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing, deleting]);

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleting.note_id, {
      onSuccess: () => {
        setDeleting(null);
        setEditing(null); // also closes the editor if it was deleted from there
      },
    });
  };

  const handleCancelDelete = () => {
    deleteMutation.reset();
    setDeleting(null);
  };

  const subtitle = isPending
    ? "Loading your notes…"
    : search
      ? `${total} result${total === 1 ? "" : "s"} for “${search}”`
      : total === 0
        ? "Capture your first idea"
        : `${total} note${total === 1 ? "" : "s"}`;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
        </div>

        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
        >
          <Plus size={16} />
          New note
          <kbd className="hidden rounded border border-white/20 bg-white/10 px-1.5 text-[10px] font-medium sm:inline">
            N
          </kbd>
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
        />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          maxLength={100}
          placeholder="Search your notes"
          aria-label="Search notes"
          className="w-full rounded-xl border border-white/10 bg-surface py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-fg-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-fg-subtle transition hover:bg-white/5 hover:text-fg"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        {isPending ? (
          <NotesSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-sm text-red-300">{getErrorMessage(error)}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
            >
              Try again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            searching={Boolean(search)}
            query={search}
            onCreate={() => setEditing("new")}
            onClear={() => setSearchInput("")}
          />
        ) : (
          <>
            <div
              className={`grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
                isPlaceholderData ? "opacity-60" : ""
              }`}
            >
              {notes.map((note) => (
                <NoteCard
                  key={note.note_id}
                  note={note}
                  onOpen={setEditing}
                  onDelete={setDeleting}
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more notes"}
                </button>
                <p className="text-xs text-fg-subtle">
                  Showing {notes.length} of {total}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Editor modal */}
      {editing && (
        <NoteEditorModal
          key={editing === "new" ? "new" : editing.note_id}
          note={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onDelete={setDeleting}
        />
      )}

      {/* Delete confirmation (sits above the editor if opened from there) */}
      {deleting && (
        <ConfirmDialog
          title="Delete this note?"
          message={`“${truncate(deleting.note_title, 60)}” will be permanently deleted. This can’t be undone.`}
          confirmLabel="Delete note"
          loading={deleteMutation.isPending}
          error={
            deleteMutation.isError ? getErrorMessage(deleteMutation.error) : ""
          }
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
