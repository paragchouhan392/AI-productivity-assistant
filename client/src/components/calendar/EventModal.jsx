import { useState } from "react";
import { CalendarDays, RotateCcw, Trash2, X } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { relativeDay } from "@/lib/calendar";
import { addDays } from "@/lib/date";
import { DEFAULT_EVENT_TYPE, EVENT_TYPE_LIST } from "@/lib/eventTypes";
import { dangerBtn, ghostBtn, primaryBtn } from "@/lib/buttonStyles";
import Modal from "@/components/ui/Modal";
import SegmentedControl from "@/components/ui/SegmentedControl";

const inputClass =
  "rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-sm text-fg outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

const chipClass = (active) =>
  `rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
    active
      ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
      : "border-white/10 text-fg-muted hover:bg-white/5 hover:text-fg"
  }`;

const TIME_PRESETS = ["09:00", "12:00", "15:00", "18:00"];

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </p>
      {children}
    </div>
  );
}

// event = null means "create a new event" on defaultDate
export default function EventModal({
  event,
  defaultDate,
  today,
  onClose,
  onDelete,
  onSaved,
}) {
  const isEdit = Boolean(event);

  // Snapshot of what the modal opened with (used by Reset and the dirty check)
  const [initial] = useState(() => ({
    title: event?.event_title ?? "",
    description: event?.event_description ?? "",
    date: event?.event_date ?? defaultDate,
    timed: Boolean(event?.event_time),
    time: event?.event_time ?? "09:00",
    type: event?.event_type ?? DEFAULT_EVENT_TYPE,
  }));

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [date, setDate] = useState(initial.date);
  const [timed, setTimed] = useState(initial.timed);
  const [time, setTime] = useState(initial.time);
  const [type, setType] = useState(initial.type);
  const [error, setError] = useState("");
  const [confirmingClose, setConfirmingClose] = useState(false);

  const create = useCreateEvent();
  const update = useUpdateEvent();
  const saving = create.isPending || update.isPending;

  const trimmedTitle = title.trim();
  const effectiveTime = timed ? time : ""; // "" = all day
  const initialTime = initial.timed ? initial.time : "";

  const dirty =
    trimmedTitle !== initial.title ||
    description !== initial.description ||
    date !== initial.date ||
    effectiveTime !== initialTime ||
    type !== initial.type;
  const canSave =
    dirty &&
    trimmedTitle !== "" &&
    date !== "" &&
    (!timed || time !== "") &&
    !saving;

  const reset = () => {
    setTitle(initial.title);
    setDescription(initial.description);
    setDate(initial.date);
    setTimed(initial.timed);
    setTime(initial.time);
    setType(initial.type);
    setError("");
  };

  // Esc, backdrop click and the X button all go through here
  const requestClose = () => {
    if (saving) return;
    if (confirmingClose) {
      setConfirmingClose(false);
    } else if (dirty) {
      setConfirmingClose(true);
    } else {
      onClose();
    }
  };

  const save = async () => {
    if (!canSave) return;
    setError("");

    try {
      if (isEdit) {
        // Send only what changed
        const changes = {};
        if (trimmedTitle !== initial.title) changes.event_title = trimmedTitle;
        if (description !== initial.description)
          changes.event_description = description;
        if (date !== initial.date) changes.event_date = date;
        if (effectiveTime !== initialTime)
          changes.event_time = effectiveTime || null;
        if (type !== initial.type) changes.event_type = type;

        if (Object.keys(changes).length === 0) {
          onClose();
          return;
        }
        await update.mutateAsync({ id: event.event_id, ...changes });
      } else {
        await create.mutateAsync({
          event_title: trimmedTitle,
          event_description: description,
          event_date: date,
          event_type: type,
          ...(effectiveTime ? { event_time: effectiveTime } : {}),
        });
      }
      onSaved?.(date);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      save();
    }
  };

  const dateChips = [
    { label: "Today", value: today },
    { label: "Tomorrow", value: addDays(today, 1) },
    { label: "Next week", value: addDays(today, 7) },
  ];

  return (
    <Modal onClose={requestClose} label={isEdit ? "Edit event" : "New event"}>
      <div className="flex max-h-[90vh] flex-col" onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
            <CalendarDays size={14} className="text-brand-300" />
            {isEdit ? "Edit event" : "New event"}
            {dirty && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300">
                Unsaved changes
              </span>
            )}
          </div>
          <button
            onClick={requestClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-fg-subtle transition hover:bg-white/5 hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-4">
          <div>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Event title"
              aria-label="Event title"
              className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-fg-subtle"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              placeholder="Add details (optional)"
              aria-label="Event details"
              className="mt-2 h-24 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-fg-subtle"
            />
          </div>

          <Field label="Date">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Event date"
                className={inputClass}
              />
              {date && (
                <span className="text-sm text-fg-muted">
                  {relativeDay(date, today)}
                </span>
              )}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {dateChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setDate(chip.value)}
                  className={chipClass(date === chip.value)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Time">
            <SegmentedControl
              label="Time"
              value={timed ? "timed" : "allday"}
              onChange={(value) => setTimed(value === "timed")}
              options={[
                { value: "allday", label: "All day" },
                { value: "timed", label: "At a time" },
              ]}
            />

            {timed && (
              <div className="mt-3">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  aria-label="Event time"
                  className={inputClass}
                />
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {TIME_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTime(preset)}
                      className={`${chipClass(time === preset)} tabular-nums`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Field>

          <Field label="Type">
            <div
              role="radiogroup"
              aria-label="Event type"
              className="flex flex-wrap gap-2"
            >
              {EVENT_TYPE_LIST.map((option) => {
                const active = type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setType(option.value)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-brand-500/60 bg-brand-500/15 text-fg"
                        : "border-white/10 text-fg-muted hover:bg-white/5 hover:text-fg"
                    }`}
                  >
                    <span className={`size-2 rounded-full ${option.dot}`} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="border-t border-line px-5 py-3">
          {error && (
            <p
              role="alert"
              className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {confirmingClose ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fg-muted">
                Discard your unsaved changes?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmingClose(false)}
                  className={ghostBtn}
                >
                  Keep editing
                </button>
                <button onClick={onClose} className={dangerBtn}>
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                {isEdit && (
                  <button
                    onClick={() => onDelete(event)}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-fg-subtle transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={reset}
                  disabled={!dirty || saving}
                  className={ghostBtn}
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
                <button
                  onClick={onClose}
                  disabled={saving}
                  className={ghostBtn}
                >
                  {dirty ? "Discard changes" : "Close"}
                </button>
                <button
                  onClick={save}
                  disabled={!canSave}
                  title="Save (Ctrl+Enter)"
                  className={primaryBtn}
                >
                  {saving ? "Saving…" : isEdit ? "Save" : "Add event"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
