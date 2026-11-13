import { useEffect, useState } from "react";
import { ClipboardList, Plus, SearchX, X } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import {
  useDeleteTask,
  useTaskStats,
  useTasksList,
  useUpdateTask,
} from "@/hooks/useTasks";
import useDebounce from "@/hooks/useDebounce";
import useToday from "@/hooks/useToday";
import TasksOverview from "@/components/tasks/TasksOverview";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskRow from "@/components/tasks/TaskRow";
import TaskModal from "@/components/tasks/TaskModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

function TasksSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-2xl border border-white/5 bg-surface"
        />
      ))}
    </div>
  );
}

function EmptyAll({ onCreate }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
        <ClipboardList size={26} />
      </div>
      <h2 className="mt-5 text-lg font-semibold">
        Capture what&rsquo;s coming
      </h2>
      <p className="mt-2 text-sm text-fg-muted">
        Add things you want to do later, with or without a deadline, and track
        them from pending to done.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
      >
        <Plus size={16} />
        Add your first task
      </button>
    </div>
  );
}

function NoMatches({ onClear }) {
  return (
    <div className="mx-auto mt-6 max-w-md rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/5 text-fg-subtle">
        <SearchX size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold">No tasks match</h2>
      <p className="mt-2 text-sm text-fg-muted">
        Try different filters, or clear them to see everything.
      </p>
      <button
        onClick={onClear}
        className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
      >
        Clear filters
      </button>
    </div>
  );
}

export default function Tasks() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 350);
  const [status, setStatus] = useState("");
  const [due, setDue] = useState("");
  const [sort, setSort] = useState("deadline");

  const [editing, setEditing] = useState(null); // a task, "new", or null
  const [deleting, setDeleting] = useState(null);
  const [actionError, setActionError] = useState("");

  const today = useToday();
  const statsQuery = useTaskStats();
  const stats = statsQuery.data;

  const list = useTasksList({ status, due, sort, search });
  const quickUpdate = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const tasks = list.data?.pages.flatMap((page) => page.tasks) ?? [];
  const total = list.data?.pages[0]?.pagination.total ?? 0;
  const hasFilters = Boolean(status || due || search);
  const noTasksAtAll = stats?.total === 0 && !hasFilters;
  const busyId = quickUpdate.isPending ? quickUpdate.variables?.id : null;

  const clearFilters = () => {
    setStatus("");
    setDue("");
    setSearchInput("");
  };

  // Press "N" to add a task (when not typing somewhere)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey)
        return;
      const tag = e.target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.target.isContentEditable
      )
        return;
      if (editing || deleting) return;
      e.preventDefault();
      setEditing("new");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing, deleting]);

  const changeStatus = (task, newStatus) => {
    setActionError("");
    quickUpdate.mutate(
      { id: task.task_id, status: newStatus },
      { onError: (err) => setActionError(getErrorMessage(err)) },
    );
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleting.task_id, {
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

  const subtitle = !stats
    ? "Loading your tasks…"
    : stats.total === 0
      ? "Nothing here yet"
      : `${stats.total} task${stats.total === 1 ? "" : "s"} · ${stats.completed} completed`;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
        </div>

        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
        >
          <Plus size={16} />
          New task
          <kbd className="hidden rounded border border-white/20 bg-white/10 px-1.5 text-[10px] font-medium sm:inline">
            N
          </kbd>
        </button>
      </div>

      {actionError && (
        <div
          role="alert"
          className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {actionError}
          <button onClick={() => setActionError("")} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      {noTasksAtAll ? (
        <EmptyAll onCreate={() => setEditing("new")} />
      ) : (
        <>
          {/* Progress */}
          {stats ? (
            <TasksOverview
              stats={stats}
              overdueActive={due === "overdue"}
              onToggleOverdue={() => setDue(due === "overdue" ? "" : "overdue")}
            />
          ) : (
            <div className="mt-6 h-32 animate-pulse rounded-2xl border border-white/5 bg-surface" />
          )}

          {/* Filters */}
          <TaskFilters
            stats={stats}
            status={status}
            due={due}
            sort={sort}
            searchInput={searchInput}
            onStatus={setStatus}
            onDue={setDue}
            onSort={setSort}
            onSearch={setSearchInput}
          />

          {/* List */}
          <div className="mt-6">
            {list.isPending ? (
              <TasksSkeleton />
            ) : list.isError ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
                <p className="text-sm text-red-300">
                  {getErrorMessage(list.error)}
                </p>
                <button
                  onClick={() => list.refetch()}
                  className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
                >
                  Try again
                </button>
              </div>
            ) : tasks.length === 0 ? (
              <NoMatches onClear={clearFilters} />
            ) : (
              <>
                {hasFilters && (
                  <p className="mb-3 text-xs text-fg-subtle">
                    {total} task{total === 1 ? "" : "s"} match your filters
                  </p>
                )}

                <div
                  className={`space-y-3 transition-opacity ${
                    list.isPlaceholderData ? "opacity-60" : ""
                  }`}
                >
                  {tasks.map((task) => (
                    <TaskRow
                      key={task.task_id}
                      task={task}
                      today={today}
                      busy={busyId === task.task_id}
                      onOpen={setEditing}
                      onDelete={setDeleting}
                      onToggle={(t) =>
                        changeStatus(
                          t,
                          t.status === "completed" ? "pending" : "completed",
                        )
                      }
                      onStart={(t) => changeStatus(t, "in_progress")}
                    />
                  ))}
                </div>

                {list.hasNextPage && (
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <button
                      onClick={() => list.fetchNextPage()}
                      disabled={list.isFetchingNextPage}
                      className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:opacity-50"
                    >
                      {list.isFetchingNextPage ? "Loading…" : "Load more tasks"}
                    </button>
                    <p className="text-xs text-fg-subtle">
                      Showing {tasks.length} of {total}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Add / edit modal */}
      {editing && (
        <TaskModal
          key={editing === "new" ? "new" : editing.task_id}
          task={editing === "new" ? null : editing}
          today={today}
          onClose={() => setEditing(null)}
          onDelete={setDeleting}
        />
      )}

      {/* Delete confirmation (sits above the editor if opened from there) */}
      {deleting && (
        <ConfirmDialog
          title="Delete this task?"
          message={`“${truncate(deleting.task_title, 60)}” will be permanently deleted. This can’t be undone.`}
          confirmLabel="Delete task"
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
