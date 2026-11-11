import { useState } from "react";
import { ListTodo, Lock, Plus, RotateCcw, Trash2, X, Zap } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import {
  useCreateExtra,
  useCreatePlanned,
  useUpdateTodo,
} from "@/hooks/usePlanner";
import { addDays } from "@/lib/date";
import { toHHMM } from "@/lib/duration";
import { STATUS_OPTIONS } from "@/lib/plannerStatus";
import { dangerBtn, ghostBtn, primaryBtn } from "@/lib/buttonStyles";
import Modal from "@/components/ui/Modal";
import DurationInput from "@/components/ui/DurationInput";
import SegmentedControl from "@/components/ui/SegmentedControl";

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

// mode: "create" (planned task) | "extra" (unplanned task) | "edit"
export default function PlannerTaskModal({
  mode,
  todo,
  today,
  defaultDate,
  onClose,
  onDelete,
  onSaved,
}) {
  const isEdit = mode === "edit";
  const isExtra = mode === "extra" || Boolean(todo?.is_extra);
  const readOnly = isEdit && todo.todo_date < today; // past days
  const canLog = isEdit && todo.todo_date === today; // time + status can change
  const showActual = mode === "extra" || (isEdit && todo.todo_date <= today);
  const actualEditable = mode === "extra" || canLog;
  const showStatus = isEdit && !isExtra && todo.todo_date <= today;
  const tomorrow = addDays(today, 1);

  // Snapshot of the values the modal opened with (used by Reset and the dirty check)
  const [initial] = useState(() => ({
    title: todo?.todo_title ?? "",
    description: todo?.todo_description ?? "",
    date: defaultDate,
    alloted: isEdit
      ? (todo.alloted_minutes ?? null)
      : mode === "extra"
        ? null
        : 60,
    actual: isEdit ? todo.actual_minutes : mode === "extra" ? 30 : 0,
    status: todo?.status ?? "pending",
  }));

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [date, setDate] = useState(initial.date);
  const [alloted, setAlloted] = useState(initial.alloted);
  const [actual, setActual] = useState(initial.actual);
  const [status, setStatus] = useState(initial.status);
  const [error, setError] = useState("");
  const [confirmingClose, setConfirmingClose] = useState(false);

  const createPlanned = useCreatePlanned();
  const createExtra = useCreateExtra();
  const update = useUpdateTodo();
  const saving =
    createPlanned.isPending || createExtra.isPending || update.isPending;

  const trimmedTitle = title.trim();
  const dirty =
    trimmedTitle !== initial.title ||
    description !== initial.description ||
    date !== initial.date ||
    alloted !== initial.alloted ||
    actual !== initial.actual ||
    status !== initial.status;

  let problem = "";
  if (!isExtra && (alloted ?? 0) <= 0) {
    problem = "Set the time you plan to spend.";
  } else if (isExtra && actual <= 0) {
    problem = "Enter the time you spent.";
  } else if (isExtra && alloted !== null && alloted <= 0) {
    problem = "Planned time must be more than zero, or remove it.";
  } else if (showStatus && status === "completed" && actual <= 0) {
    problem = "Add the time you spent before marking this as completed.";
  }

  const canSave =
    !readOnly && dirty && trimmedTitle !== "" && !problem && !saving;

  const reset = () => {
    setTitle(initial.title);
    setDescription(initial.description);
    setDate(initial.date);
    setAlloted(initial.alloted);
    setActual(initial.actual);
    setStatus(initial.status);
    setError("");
  };

  // Esc, backdrop click and the X button all go through here
  const requestClose = () => {
    if (saving) return;
    if (confirmingClose) {
      setConfirmingClose(false);
    } else if (dirty && !readOnly) {
      setConfirmingClose(true);
    } else {
      onClose();
    }
  };

  const handleStatus = (value) => {
    setStatus(value);
    // Completing a task with no time logged: start from the planned time
    if (value === "completed" && actual === 0) setActual(alloted ?? 0);
  };

  const save = async () => {
    if (!canSave) return;
    setError("");

    try {
      if (mode === "create") {
        await createPlanned.mutateAsync({
          todo_title: trimmedTitle,
          todo_description: description,
          todo_date: date,
          alloted_time: toHHMM(alloted),
        });
        onSaved?.(date);
      } else if (mode === "extra") {
        await createExtra.mutateAsync({
          todo_title: trimmedTitle,
          todo_description: description,
          actual_time: toHHMM(actual),
          ...(alloted ? { alloted_time: toHHMM(alloted) } : {}),
        });
        onSaved?.(today);
      } else {
        // Send only what changed
        const changes = {};
        if (trimmedTitle !== initial.title) changes.todo_title = trimmedTitle;
        if (description !== initial.description)
          changes.todo_description = description;
        if (alloted !== initial.alloted) {
          changes.alloted_time = alloted === null ? null : toHHMM(alloted);
        }
        if (canLog) {
          if (actual !== initial.actual) changes.actual_time = toHHMM(actual);
          if (showStatus && status !== initial.status) changes.status = status;
        }

        if (Object.keys(changes).length === 0) {
          onClose();
          return;
        }
        await update.mutateAsync({ id: todo.daily_task_id, ...changes });
      }
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

  const HeaderIcon = readOnly ? Lock : isExtra ? Zap : ListTodo;
  const headerText =
    mode === "create"
      ? "New task"
      : mode === "extra"
        ? "Extra task"
        : readOnly
          ? "Past task · read-only"
          : isExtra
            ? "Edit extra task"
            : "Edit task";

  return (
    <Modal onClose={requestClose} label={headerText}>
      <div className="flex max-h-[90vh] flex-col" onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
            <HeaderIcon
              size={14}
              className={isExtra ? "text-violet-300" : "text-brand-300"}
            />
            {headerText}
            {dirty && !readOnly && (
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
              autoFocus={!readOnly}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              readOnly={readOnly}
              placeholder="What do you want to do?"
              aria-label="Task title"
              className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-fg-subtle"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              readOnly={readOnly}
              placeholder="Add details (optional)"
              aria-label="Task details"
              className="mt-2 h-20 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-fg-subtle"
            />
          </div>

          {mode === "create" && (
            <Field label="When">
              <SegmentedControl
                label="Day"
                value={date}
                onChange={setDate}
                options={[
                  { value: today, label: "Today" },
                  { value: tomorrow, label: "Tomorrow" },
                ]}
              />
            </Field>
          )}

          <Field label={isExtra ? "Planned time (optional)" : "Planned time"}>
            {alloted === null ? (
              readOnly ? (
                <p className="text-sm text-fg-subtle">None</p>
              ) : (
                <button
                  type="button"
                  onClick={() => setAlloted(30)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-sm text-fg-muted transition hover:bg-white/5 hover:text-fg"
                >
                  <Plus size={14} />
                  Add planned time
                </button>
              )
            ) : (
              <div>
                <DurationInput
                  value={alloted}
                  onChange={setAlloted}
                  disabled={readOnly}
                  label="Planned time"
                />
                {isExtra && !readOnly && (
                  <button
                    type="button"
                    onClick={() => setAlloted(null)}
                    className="mt-2 text-xs text-fg-subtle transition hover:text-fg"
                  >
                    Remove planned time
                  </button>
                )}
              </div>
            )}
          </Field>

          {showActual && (
            <Field label={isExtra ? "Time spent" : "Actual time spent"}>
              <DurationInput
                value={actual}
                onChange={setActual}
                disabled={!actualEditable}
                label="Time spent"
              />
            </Field>
          )}

          {showStatus && (
            <Field label="Status">
              <SegmentedControl
                label="Status"
                value={status}
                onChange={handleStatus}
                options={STATUS_OPTIONS}
                disabled={!canLog}
              />
            </Field>
          )}

          {isEdit && !readOnly && todo.todo_date > today && (
            <p className="rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-xs text-fg-muted">
              You can log time and mark this task done once the day starts.
            </p>
          )}
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
          ) : readOnly ? (
            <div className="flex justify-end">
              <button onClick={onClose} className={ghostBtn}>
                Close
              </button>
            </div>
          ) : (
            <div>
              {problem && dirty && (
                <p className="mb-2 text-xs text-amber-300">{problem}</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  {isEdit && (
                    <button
                      onClick={() => onDelete(todo)}
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
                    {saving ? "Saving…" : mode === "edit" ? "Save" : "Add task"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
