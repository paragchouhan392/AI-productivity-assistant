import { Plus } from "lucide-react";
import { dayHeading, relativeDay } from "@/lib/calendar";
import EventListItem from "./EventListItem";

export default function DayPanel({
  selected,
  today,
  events,
  upcoming,
  onAdd,
  onOpenEvent,
  onDelete,
}) {
  const { weekday, dayMonth } = dayHeading(selected);

  return (
    <aside className="rounded-2xl border border-white/10 bg-surface p-5 lg:sticky lg:top-6 lg:self-start">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-brand-300">
            {relativeDay(selected, today)}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {weekday}
          </h2>
          <p className="text-sm text-fg-muted">{dayMonth}</p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {events.length > 0 ? (
          events.map((event) => (
            <EventListItem
              key={event.event_id}
              event={event}
              today={today}
              onOpen={onOpenEvent}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-fg-muted">
            Nothing scheduled.
            <button
              onClick={onAdd}
              className="ml-1.5 font-medium text-brand-400 hover:underline"
            >
              Add an event
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-line pt-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
          Coming up
        </h3>

        {upcoming === undefined ? (
          <div className="space-y-2" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-white/5"
              />
            ))}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="space-y-2">
            {upcoming.map((event) => (
              <EventListItem
                key={event.event_id}
                event={event}
                today={today}
                showDate
                onOpen={onOpenEvent}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-fg-muted">No events in the next 7 days.</p>
        )}
      </div>
    </aside>
  );
}
