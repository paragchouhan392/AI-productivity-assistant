import { CalendarDays, Check, Play, Trash2 } from "lucide-react";
import Pill from "@/components/ui/Pill";
import { describeDeadline } from "@/lib/deadline";
import { STATUS_META } from "@/lib/plannerStatus";
import { timeAgo } from "@/lib/time";

function StatusToggle({ status, title, busy, onToggle }) {
  const done = status === "completed";
  const label = done ? "Mark as not completed" : "Mark as completed";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      title={label}
      aria-label={`${label}: ${title}`}
      className="group/toggle absolute left-4 top-[1.15rem] z-10 grid size-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 disabled:opacity-50"
    >
      {done ? (
        <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white">
          <Check size={14} strokeWidth={3} />
        </span>
      ) : (
        <span
          className={`grid size-6 place-items-center rounded-full border-2 transition-colors group-hover/toggle:border-emerald-400 group-hover/toggle:bg-emerald-500/10 ${
            status === "in_progress" ? "border-brand-400" : "border-white/20"
          }`}
        >
          {status === "in_progress" && (
            <span className="size-2 rounded-full bg-brand-400 group-hover/toggle:hidden" />
          )}
          <Check
            size={13}
            strokeWidth={3}
            className="hidden text-emerald-400 group-hover/toggle:block"
          />
        </span>
      )}
    </button>
  );
}

export default function TaskRow({
  task,
  today,
  busy,
  onOpen,
  onDelete,
  onToggle,
  onStart,
}) {
  const done = task.status === "completed";
  const deadline = describeDeadline(task.deadline, today, done);
  const overdue = deadline?.tone === "red";
  const meta = STATUS_META[task.status];

  return (
    <article
      className={`relative rounded-2xl border bg-surface p-4 transition-colors hover:border-brand-500/30 ${
        overdue ? "border-red-500/25" : "border-white/10"
      }`}
    >
      {/* Makes the whole card clickable */}
      <button
        type="button"
        onClick={() => onOpen(task)}
        aria-label={`Open task: ${task.task_title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      />

      <div className="pointer-events-none flex items-start gap-3">
        <span className="size-6 shrink-0" aria-hidden />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 pr-8">
            <h3
              className={`font-semibold leading-snug ${
                done ? "text-fg-muted line-through decoration-white/20" : ""
              }`}
            >
              {task.task_title}
            </h3>
            <Pill tone={meta.tone} className="hidden sm:inline-flex">
              {meta.label}
            </Pill>
          </div>

          {task.task_description && (
            <p
              className={`mt-1 line-clamp-2 text-sm ${
                done ? "text-fg-subtle" : "text-fg-muted"
              }`}
            >
              {task.task_description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            {deadline && (
              <Pill tone={deadline.tone}>
                <CalendarDays size={12} className="mr-1" />
                {deadline.label}
              </Pill>
            )}
            <span className="text-xs text-fg-subtle">
              Added {timeAgo(task.created_at)}
            </span>

            {task.status === "pending" && (
              <button
                type="button"
                onClick={() => onStart(task)}
                disabled={busy}
                className="pointer-events-auto relative z-10 ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:opacity-50"
              >
                <Play size={12} />
                Start
              </button>
            )}
          </div>
        </div>
      </div>

      <StatusToggle
        status={task.status}
        title={task.task_title}
        busy={busy}
        onToggle={() => onToggle(task)}
      />

      <button
        type="button"
        onClick={() => onDelete(task)}
        aria-label={`Delete task: ${task.task_title}`}
        className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-fg-subtle/70 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
      >
        <Trash2 size={16} />
      </button>
    </article>
  );
}
