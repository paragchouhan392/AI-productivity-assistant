import { formatDuration } from "@/lib/duration";

function Tile({ label, value, sub, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {children}
      <p className="mt-1.5 text-xs text-fg-muted">{sub}</p>
    </div>
  );
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function DaySummary({ summary: s }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Tile
        label="Progress"
        value={`${s.planned_completion_percentage}%`}
        sub={
          s.planned_count
            ? `${s.planned_completed} of ${plural(s.planned_count, "planned task")} done`
            : "No planned tasks"
        }
      >
        <div className="mt-2 h-1.5 rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-300"
            style={{ width: `${s.planned_completion_percentage}%` }}
          />
        </div>
      </Tile>

      <Tile
        label="Planned time"
        value={formatDuration(s.planned_alloted_minutes)}
        sub={`across ${plural(s.planned_count, "planned task")}`}
      />

      <Tile
        label="Time logged"
        value={formatDuration(s.total_actual_minutes)}
        sub={`${formatDuration(s.planned_actual_minutes)} planned work · ${formatDuration(
          s.extra_actual_minutes,
        )} extra`}
      />

      <Tile
        label="Extra work"
        value={s.extra_count}
        sub={`${formatDuration(s.extra_actual_minutes)} of unplanned work`}
      />
    </div>
  );
}
