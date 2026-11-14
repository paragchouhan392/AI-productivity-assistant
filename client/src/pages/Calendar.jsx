import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import {
  useDeleteEvent,
  useEventsRange,
  useUpcomingEvents,
} from "@/hooks/useEvents";
import useToday from "@/hooks/useToday";
import { buildMonthGrid, firstOfMonth, monthTitle } from "@/lib/calendar";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import TypeLegend from "@/components/calendar/TypeLegend";
import MonthGrid from "@/components/calendar/MonthGrid";
import DayPanel from "@/components/calendar/DayPanel";
import EventModal from "@/components/calendar/EventModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

export default function Calendar() {
  const today = useToday();

  // null = "follow today"
  const [monthOverride, setMonthOverride] = useState(null);
  const [selectedOverride, setSelectedOverride] = useState(null);
  const [hiddenTypes, setHiddenTypes] = useState([]);

  const [modal, setModal] = useState(null); // { event } for edit, { date } for create
  const [deleting, setDeleting] = useState(null);

  const currentMonth = firstOfMonth(today);
  const viewMonth = monthOverride ?? currentMonth;
  const selected = selectedOverride ?? today;

  const days = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const rangeQuery = useEventsRange(days[0], days[days.length - 1]);
  const upcomingQuery = useUpcomingEvents(7);
  const deleteMutation = useDeleteEvent();

  const monthPrefix = viewMonth.slice(0, 7);

  // Events in this month (for counts and the subtitle)
  const monthEvents = useMemo(
    () =>
      (rangeQuery.data?.events ?? []).filter((e) =>
        e.event_date.startsWith(monthPrefix),
      ),
    [rangeQuery.data, monthPrefix],
  );

  const counts = useMemo(
    () =>
      monthEvents.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {}),
    [monthEvents],
  );

  // Events shown on the grid (type filters applied)
  const eventsByDate = useMemo(() => {
    const map = new Map();
    for (const event of rangeQuery.data?.events ?? []) {
      if (hiddenTypes.includes(event.event_type)) continue;
      const list = map.get(event.event_date) ?? [];
      list.push(event);
      map.set(event.event_date, list);
    }
    return map;
  }, [rangeQuery.data, hiddenTypes]);

  const upcoming = upcomingQuery.data
    ? upcomingQuery.data.events
        .filter((e) => !hiddenTypes.includes(e.event_type))
        .slice(0, 6)
    : undefined;

  const goToMonth = (month) => {
    const isCurrent = month === currentMonth;
    setMonthOverride(isCurrent ? null : month);
    setSelectedOverride(isCurrent ? null : month);
  };

  const goToToday = () => {
    setMonthOverride(null);
    setSelectedOverride(null);
  };

  // Select a day, switching month if it belongs to another one
  const jumpTo = (date) => {
    const month = firstOfMonth(date);
    setMonthOverride(month === currentMonth ? null : month);
    setSelectedOverride(date === today ? null : date);
  };

  const toggleType = (type) =>
    setHiddenTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

  const openCreate = (date = selected) => setModal({ date });
  const openEdit = (event) => setModal({ event });

  // Press "N" to add an event on the selected day (when not typing somewhere)
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
      if (modal || deleting) return;
      e.preventDefault();
      setModal({ date: selected });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, deleting, selected]);

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleting.event_id, {
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

  const subtitle =
    monthEvents.length === 0
      ? `No events in ${monthTitle(viewMonth)}`
      : `${monthEvents.length} event${monthEvents.length === 1 ? "" : "s"} in ${monthTitle(viewMonth)}`;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
        </div>

        <button
          onClick={() => openCreate()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
        >
          <Plus size={16} />
          New event
          <kbd className="hidden rounded border border-white/20 bg-white/10 px-1.5 text-[10px] font-medium sm:inline">
            N
          </kbd>
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <CalendarHeader
          monthStart={viewMonth}
          isCurrentMonth={viewMonth === currentMonth}
          loading={rangeQuery.isFetching}
          onChangeMonth={goToMonth}
          onToday={goToToday}
        />
        <TypeLegend
          counts={counts}
          hidden={hiddenTypes}
          onToggle={toggleType}
          onReset={() => setHiddenTypes([])}
        />
      </div>

      {rangeQuery.isError && (
        <div
          role="alert"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {getErrorMessage(rangeQuery.error)}
          <button
            onClick={() => rangeQuery.refetch()}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
          >
            Try again
          </button>
        </div>
      )}

      {/* Calendar + day panel */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <MonthGrid
          days={days}
          viewMonth={viewMonth}
          today={today}
          selected={selected}
          eventsByDate={eventsByDate}
          onSelect={jumpTo}
          onAdd={openCreate}
          onOpenEvent={openEdit}
        />

        <DayPanel
          selected={selected}
          today={today}
          events={eventsByDate.get(selected) ?? []}
          upcoming={upcoming}
          onAdd={() => openCreate()}
          onOpenEvent={openEdit}
          onDelete={setDeleting}
        />
      </div>

      {/* Add / edit modal */}
      {modal && (
        <EventModal
          key={modal.event ? modal.event.event_id : `new-${modal.date}`}
          event={modal.event ?? null}
          defaultDate={modal.date ?? selected}
          today={today}
          onClose={() => setModal(null)}
          onDelete={setDeleting}
          onSaved={jumpTo}
        />
      )}

      {/* Delete confirmation (sits above the editor if opened from there) */}
      {deleting && (
        <ConfirmDialog
          title="Delete this event?"
          message={`“${truncate(deleting.event_title, 60)}” will be removed from your calendar. This can’t be undone.`}
          confirmLabel="Delete event"
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
