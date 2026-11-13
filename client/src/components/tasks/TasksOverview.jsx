export default function TasksOverview({
  stats,
  overdueActive,
  onToggleOverdue,
}) {
  const pct = stats.completion_percentage;
  const hasOverdue = stats.overdue > 0;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-surface p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            Overall progress
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{pct}%</p>
          <p className="mt-1 text-sm text-fg-muted">
            {stats.completed} of {stats.total} task
            {stats.total === 1 ? "" : "s"} completed
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onToggleOverdue}
            disabled={!hasOverdue && !overdueActive}
            aria-pressed={overdueActive}
            title={overdueActive ? "Show all tasks" : "Show overdue tasks"}
            className={`rounded-xl border px-4 py-2 text-left transition-colors disabled:cursor-default ${
              hasOverdue
                ? `border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/15 ${
                    overdueActive ? "ring-2 ring-red-400/50" : ""
                  }`
                : "border-white/10 text-fg-muted"
            }`}
          >
            <span className="block text-xl font-semibold tabular-nums">
              {stats.overdue}
            </span>
            <span className="text-xs">Overdue</span>
          </button>

          <div className="rounded-xl border border-white/10 px-4 py-2 text-fg-muted">
            <span className="block text-xl font-semibold tabular-nums text-fg">
              {stats.due_this_week}
            </span>
            <span className="text-xs">Due this week</span>
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-linear-to-r from-brand-500 to-violet-500 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
