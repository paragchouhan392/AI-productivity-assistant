import { Check, Play, RotateCcw, Trash2 } from "lucide-react";
import Pill from "@/components/ui/Pill";
import { formatDuration } from "@/lib/duration";
import { STATUS_META } from "@/lib/plannerStatus";

function StatusDot({ status }) {
  if (status === "completed") {
    return (
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-brand-400">
        <span className="size-2 rounded-full bg-brand-400" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 size-6 shrink-0 rounded-full border-2 border-white/15" />
  );
}

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

// mode: "today" | "future" | "past"
export default function PlannerTaskRow({
  todo,
  mode,
  busy,
  onOpen,
  onDelete,
  onStart,
  onComplete,
  onReopen,
}) {
  const planned = todo.alloted_minutes ?? 0;
  const actual = todo.actual_minutes;
  const done = todo.status === "completed";
  const over = actual > planned;
  const diff = actual - planned;
  const percent = planned > 0 ? Math.min(actual / planned, 1) * 100 : 0;
  const barColor = over
    ? "bg-amber-400"
    : done
      ? "bg-emerald-400"
      : "bg-brand-500";
  const meta = STATUS_META[todo.status];
  const showSpent = actual > 0 || todo.status !== "pending";

  return (
    <article className="relative rounded-2xl border border-white/10 bg-surface p-4 transition-colors hover:border-brand-500/30">
      {/* Makes the whole card clickable */}
      <button
        type="button"
        onClick={() => onOpen(todo)}
        aria-label={`Open task: ${todo.todo_title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      />

      <div className="pointer-events-none flex items-start gap-3">
        <StatusDot status={todo.status} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 pr-8">
            <h3
              className={`font-semibold leading-snug ${
                done ? "text-fg-muted line-through decoration-white/20" : ""
              }`}
            >
              {todo.todo_title}
            </h3>
            <Pill tone={meta.tone} className="hidden sm:inline-flex">
              {meta.label}
            </Pill>
          </div>

          {todo.todo_description && (
            <p className="mt-1 line-clamp-1 text-sm text-fg-muted">
              {todo.todo_description}
            </p>
          )}

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-fg-subtle">
                Planned {formatDuration(planned)}
              </span>
              {showSpent && (
                <span className="text-fg-muted">
                  Spent{" "}
                  <span className="font-medium text-fg">
                    {formatDuration(actual)}
                  </span>
                  {done && (
                    <span
                      className={
                        diff > 0 ? " text-amber-300" : " text-emerald-300"
                      }
                    >
                      {" · "}
                      {diff === 0
                        ? "right on time"
                        : `${formatDuration(Math.abs(diff))} ${diff > 0 ? "over" : "under"}`}
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-white/5">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${barColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {mode === "today" && (
        <div className="relative z-10 mt-4 flex justify-end gap-2">
          {todo.status === "pending" && (
            <>
              <button
                onClick={() => onComplete(todo)}
                disabled={busy}
                className={`${actionBtn} border border-white/10 text-fg-muted hover:bg-white/5 hover:text-fg`}
              >
                <Check size={15} />
                Done
              </button>
              <button
                onClick={() => onStart(todo)}
                disabled={busy}
                className={`${actionBtn} bg-brand-600 text-white hover:bg-brand-500`}
              >
                <Play size={14} />
                Start
              </button>
            </>
          )}

          {todo.status === "in_progress" && (
            <button
              onClick={() => onComplete(todo)}
              disabled={busy}
              className={`${actionBtn} bg-emerald-600 text-white hover:bg-emerald-500`}
            >
              <Check size={15} />
              Complete
            </button>
          )}

          {done && (
            <button
              onClick={() => onReopen(todo)}
              disabled={busy}
              className={`${actionBtn} border border-white/10 text-fg-muted hover:bg-white/5 hover:text-fg`}
            >
              <RotateCcw size={14} />
              Reopen
            </button>
          )}
        </div>
      )}

      {mode !== "past" && (
        <button
          type="button"
          onClick={() => onDelete(todo)}
          aria-label={`Delete task: ${todo.todo_title}`}
          className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-fg-subtle/70 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <Trash2 size={16} />
        </button>
      )}
    </article>
  );
}
