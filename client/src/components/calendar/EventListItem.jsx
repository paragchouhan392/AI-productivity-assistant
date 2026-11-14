import { Trash2 } from "lucide-react";
import Pill from "@/components/ui/Pill";
import { dayLabel } from "@/lib/date";
import { EVENT_TYPES } from "@/lib/eventTypes";

export default function EventListItem({
  event,
  today,
  showDate = false,
  onOpen,
  onDelete,
}) {
  const meta = EVENT_TYPES[event.event_type] ?? EVENT_TYPES.other;

  return (
    <article className="relative overflow-hidden rounded-xl border border-white/10 bg-surface-2/60 py-3 pl-4 pr-3 transition-colors hover:border-brand-500/30">
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${meta.dot}`}
      />

      <button
        type="button"
        onClick={() => onOpen(event)}
        aria-label={`Open event: ${event.event_title}`}
        className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400"
      />

      <div className="pointer-events-none flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tabular-nums text-fg-subtle">
            {showDate && `${dayLabel(event.event_date, today)} · `}
            {event.event_time ?? "All day"}
          </p>
          <h3 className="mt-0.5 truncate font-medium">{event.event_title}</h3>
          {event.event_description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-fg-muted">
              {event.event_description}
            </p>
          )}
        </div>
        <Pill tone={meta.pill}>{meta.label}</Pill>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(event)}
          aria-label={`Delete event: ${event.event_title}`}
          className="absolute bottom-2 right-2 z-10 rounded-lg p-1.5 text-fg-subtle/70 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <Trash2 size={15} />
        </button>
      )}
    </article>
  );
}
