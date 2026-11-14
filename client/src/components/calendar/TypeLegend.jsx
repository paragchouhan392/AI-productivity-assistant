import { EVENT_TYPE_LIST } from "@/lib/eventTypes";

export default function TypeLegend({ counts, hidden, onToggle, onReset }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {EVENT_TYPE_LIST.map((type) => {
        const off = hidden.includes(type.value);
        return (
          <button
            key={type.value}
            onClick={() => onToggle(type.value)}
            aria-pressed={!off}
            title={
              off
                ? `Show ${type.label.toLowerCase()} events`
                : `Hide ${type.label.toLowerCase()} events`
            }
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              off
                ? "border-white/5 text-fg-subtle line-through"
                : "border-white/10 bg-surface text-fg-muted hover:text-fg"
            }`}
          >
            <span
              className={`size-2 rounded-full ${type.dot} ${off ? "opacity-30" : ""}`}
            />
            {type.label}
            <span className="tabular-nums text-fg-subtle">
              {counts[type.value] ?? 0}
            </span>
          </button>
        );
      })}

      {hidden.length > 0 && (
        <button
          onClick={onReset}
          className="text-xs font-medium text-brand-400 hover:underline"
        >
          Show all
        </button>
      )}
    </div>
  );
}
