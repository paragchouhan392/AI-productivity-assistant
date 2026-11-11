import { useEffect, useState } from "react";
import { Info, ListTodo, Lock, Plus, X, Zap } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import {
  useDeleteTodo,
  usePlannerDay,
  useUpdateTodo,
} from "@/hooks/usePlanner";
import { formatLongDate } from "@/lib/date";
import DayNavigator from "@/components/planner/DayNavigator";
import DaySummary from "@/components/planner/DaySummary";
import PlannerTaskRow from "@/components/planner/PlannerTaskRow";
import ExtraTaskRow from "@/components/planner/ExtraTaskRow";
import PlannerTaskModal from "@/components/planner/PlannerTaskModal";
import CompleteDialog from "@/components/planner/CompleteDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

function PlannerSkeleton() {
  return (
    <div aria-hidden>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-white/5 bg-surface"
          />
        ))}
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-white/5 bg-surface"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyDay({ dayMode, onAdd }) {
  const past = dayMode === "past";

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
        <ListTodo size={26} />
      </div>
      <h2 className="mt-5 text-lg font-semibold">
        {past
          ? "Nothing logged on this day"
          : dayMode === "future"
            ? "Plan tomorrow"
            : "Plan your day"}
      </h2>
      <p className="mt-2 text-sm text-fg-muted">
        {past
          ? "No tasks were planned or logged here."
          : "Decide what you want to get done, give each task some time, and log how it really went."}
      </p>
      {!past && (
        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
          <Plus size={16} />
          Add your first task
        </button>
      )}
    </div>
  );
}

function SectionHeader({ title, count, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        {title}
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium normal-case tracking-normal">
          {count}
        </span>
      </h2>
      {action}
    </div>
  );
}

export default function Planner() {
  const [selectedDate, setSelectedDate] = useState(null); // null = today
  const [modal, setModal] = useState(null); // { type: "create" | "extra" | "edit", todo? }
  const [completing, setCompleting] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [actionError, setActionError] = useState("");

  // Same query when viewing today, so this is still a single request
  const todayQuery = usePlannerDay(null);
  const dayQuery = usePlannerDay(selectedDate);
  const quickUpdate = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const today = todayQuery.data?.date;
  const day = dayQuery.data;
  const viewDate = selectedDate ?? today;

  const dayMode =
    day && today
      ? day.date === today
        ? "today"
        : day.date > today
          ? "future"
          : "past"
      : null;
  const canPlan = dayMode === "today" || dayMode === "future";
  const canAddExtra = dayMode === "today";
  const busyId = quickUpdate.isPending ? quickUpdate.variables?.id : null;

  const planned = day?.planned_tasks ?? [];
  const extras = day?.extra_tasks ?? [];
  const isEmpty = planned.length === 0 && extras.length === 0;

  // Press "N" to add a task (when not typing somewhere)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey)
        return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
        return;
      if (modal || completing || deleting || !canPlan) return;
      e.preventDefault();
      setModal({ type: "create" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, completing, deleting, canPlan]);

  const changeStatus = (todo, status) => {
    setActionError("");
    quickUpdate.mutate(
      { id: todo.daily_task_id, status },
      { onError: (err) => setActionError(getErrorMessage(err)) },
    );
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleting.daily_task_id, {
      onSuccess: () => {
        setDeleting(null);
        setModal(null); // also closes the editor if it was deleted from there
      },
    });
  };

  const handleCancelDelete = () => {
    deleteMutation.reset();
    setDeleting(null);
  };

  const rowProps = {
    mode: dayMode,
    onOpen: (todo) => setModal({ type: "edit", todo }),
    onDelete: setDeleting,
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Daily Planner
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            {viewDate ? formatLongDate(viewDate) : "Loading your day…"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {today && viewDate && (
            <DayNavigator
              viewDate={viewDate}
              today={today}
              onChange={setSelectedDate}
            />
          )}
          {canPlan && (
            <button
              onClick={() => setModal({ type: "create" })}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
            >
              <Plus size={16} />
              Add task
              <kbd className="hidden rounded border border-white/20 bg-white/10 px-1.5 text-[10px] font-medium sm:inline">
                N
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
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

      {dayMode === "past" && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-fg-muted">
          <Lock size={16} className="shrink-0 text-fg-subtle" />
          This day is over, so it&rsquo;s read-only. You can still look back at
          what you did.
        </div>
      )}
      {dayMode === "future" && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-fg-muted">
          <Info size={16} className="shrink-0 text-brand-300" />
          You&rsquo;re planning tomorrow. Logging time and marking tasks done
          opens once the day starts.
        </div>
      )}

      {/* Content */}
      {dayQuery.isError ? (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-sm text-red-300">
            {getErrorMessage(dayQuery.error)}
          </p>
          <button
            onClick={() => dayQuery.refetch()}
            className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
          >
            Try again
          </button>
        </div>
      ) : dayQuery.isPending || !day || !dayMode ? (
        <PlannerSkeleton />
      ) : (
        <div
          className={`transition-opacity ${
            dayQuery.isPlaceholderData ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {isEmpty ? (
            <EmptyDay
              dayMode={dayMode}
              onAdd={() => setModal({ type: "create" })}
            />
          ) : (
            <>
              <DaySummary summary={day.summary} />

              {/* Planned tasks */}
              <section className="mt-8">
                <SectionHeader title="Planned" count={planned.length} />
                {planned.length > 0 ? (
                  <div className="space-y-3">
                    {planned.map((todo) => (
                      <PlannerTaskRow
                        key={todo.daily_task_id}
                        todo={todo}
                        busy={busyId === todo.daily_task_id}
                        onStart={(t) => changeStatus(t, "in_progress")}
                        onReopen={(t) => changeStatus(t, "in_progress")}
                        onComplete={setCompleting}
                        {...rowProps}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 px-6 py-8 text-center text-sm text-fg-muted">
                    No planned tasks for this day.
                    {canPlan && (
                      <button
                        onClick={() => setModal({ type: "create" })}
                        className="ml-1.5 font-medium text-brand-400 hover:underline"
                      >
                        Add one
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* Extra tasks */}
              {(extras.length > 0 || canAddExtra) && (
                <section className="mt-10">
                  <SectionHeader
                    title="Extra"
                    count={extras.length}
                    action={
                      canAddExtra && extras.length > 0 ? (
                        <button
                          onClick={() => setModal({ type: "extra" })}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10"
                        >
                          <Plus size={15} />
                          Add extra
                        </button>
                      ) : null
                    }
                  />

                  {extras.length > 0 ? (
                    <div className="space-y-3">
                      {extras.map((todo) => (
                        <ExtraTaskRow
                          key={todo.daily_task_id}
                          todo={todo}
                          {...rowProps}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-violet-400/25 bg-violet-500/5 px-5 py-4">
                      <div className="flex items-center gap-3 text-sm text-fg-muted">
                        <Zap size={18} className="shrink-0 text-violet-300" />
                        Did something you hadn&rsquo;t planned? Log it as an
                        extra task.
                      </div>
                      <button
                        onClick={() => setModal({ type: "extra" })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 px-3 py-1.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10"
                      >
                        <Plus size={15} />
                        Add extra task
                      </button>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* Add / edit modal */}
      {modal && day && today && (
        <PlannerTaskModal
          key={`${modal.type}-${modal.todo?.daily_task_id ?? "new"}`}
          mode={modal.type}
          todo={modal.todo}
          today={today}
          defaultDate={dayMode === "future" ? day.date : today}
          onClose={() => setModal(null)}
          onDelete={setDeleting}
          onSaved={(date) => setSelectedDate(date === today ? null : date)}
        />
      )}

      {/* Complete a task: how long did it take? */}
      {completing && (
        <CompleteDialog
          key={completing.daily_task_id}
          todo={completing}
          onClose={() => setCompleting(null)}
        />
      )}

      {/* Delete confirmation (sits above the editor if opened from there) */}
      {deleting && (
        <ConfirmDialog
          title="Delete this task?"
          message={`“${truncate(deleting.todo_title, 60)}” will be removed from this day. This can’t be undone.`}
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
