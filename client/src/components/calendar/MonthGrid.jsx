import { Plus } from "lucide-react";
import { dayHeading, weekdayLabels, weekdayOf } from "@/lib/calendar";
import { EVENT_TYPES } from "@/lib/eventTypes";

const MAX_CHIPS = 3;

function EventChip({ event, dim, onOpen }) {
  const meta = EVENT_TYPES[event.event_type] ?? EVENT_TYPES.other;

  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      title={`${event.event_time ?? "All day"} · ${event.event_title}`}
      className={`pointer-events-auto relative z-10 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-left text-[11px] leading-tight transition hover:brightness-125 ${meta.chip} ${
        dim ? "opacity-60" : ""
      }`}
    >
      {event.event_time && (
        <span className="shrink-0 font-semibold tabular-nums">
          {event.event_time}
        </span>
      )}
      <span className="truncate">{event.event_title}</span>
    </button>
  );
}

function DayCell({
  date,
  inMonth,
  isToday,
  isSelected,
  isPast,
  events,
  onSelect,
  onAdd,
  onOpenEvent,
}) {
  const dayNumber = Number(date.slice(8));
  const weekend = [0, 6].includes(weekdayOf(date));
  const visible = events.slice(0, MAX_CHIPS);
  const extra = events.length - visible.length;
  const { weekday, dayMonth } = dayHeading(date);

  return (
    <div
      role="gridcell"
      aria-selected={isSelected}
      className={`group relative min-h-24 md:min-h-32 lg:min-h-36 ${
        inMonth ? "bg-surface" : "bg-canvas"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(date)}
        aria-label={`${weekday}, ${dayMonth}: ${events.length} event${events.length === 1 ? "" : "s"}`}
        className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400"
      />

      {isToday && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-brand-500/5"
        />
      )}
      {isSelected && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-brand-500/70"
        />
      )}

      <div className="pointer-events-none relative flex h-full flex-col p-1.5 md:p-2">
        <div className="flex items-start justify-between">
          <span
            className={`grid size-7 place-items-center rounded-full text-sm font-medium tabular-nums ${
              isToday
                ? "bg-brand-600 text-white"
                : !inMonth
                  ? "text-fg-subtle"
                  : weekend
                    ? "text-fg-muted"
                    : "text-fg"
            }`}
          >
            {dayNumber}
          </span>

          <button
            type="button"
            onClick={() => onAdd(date)}
            aria-label={`Add event on ${dayMonth}`}
            className="pointer-events-auto relative z-10 hidden size-6 place-items-center rounded-md text-fg-subtle opacity-0 transition hover:bg-white/10 hover:text-fg focus-visible:opacity-100 group-hover:opacity-100 md:grid"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Event chips (tablet and up) */}
        <div className="mt-1 hidden min-h-0 flex-1 flex-col gap-1 md:flex">
          {visible.map((event) => (
            <EventChip
              key={event.event_id}
              event={event}
              dim={isPast}
              onOpen={onOpenEvent}
            />
          ))}
          {extra > 0 && (
            <button
              type="button"
              onClick={() => onSelect(date)}
              className="pointer-events-auto relative z-10 px-1 text-left text-[11px] font-medium text-fg-muted transition hover:text-fg"
            >
              +{extra} more
            </button>
          )}
        </div>

        {/* Dots (phones) */}
        <div className="mt-auto flex flex-wrap gap-1 pb-1 md:hidden">
          {events.slice(0, 4).map((event) => (
            <span
              key={event.event_id}
              className={`size-1.5 rounded-full ${(EVENT_TYPES[event.event_type] ?? EVENT_TYPES.other).dot}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MonthGrid({
  days,
  viewMonth,
  today,
  selected,
  eventsByDate,
  onSelect,
  onAdd,
  onOpenEvent,
}) {
  const monthPrefix = viewMonth.slice(0, 7);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
      <div className="grid grid-cols-7 border-b border-line bg-surface-2/60">
        {weekdayLabels().map((label, i) => (
          <div
            key={i}
            className="py-2.5 text-center text-xs font-medium uppercase tracking-wider text-fg-subtle"
          >
            {label}
          </div>
        ))}
      </div>

      <div
        role="grid"
        aria-label="Calendar"
        className="grid grid-cols-7 gap-px bg-line"
      >
        {days.map((date) => (
          <DayCell
            key={date}
            date={date}
            inMonth={date.startsWith(monthPrefix)}
            isToday={date === today}
            isSelected={date === selected}
            isPast={date < today}
            events={eventsByDate.get(date) ?? []}
            onSelect={onSelect}
            onAdd={onAdd}
            onOpenEvent={onOpenEvent}
          />
        ))}
      </div>
    </div>
  );
}
