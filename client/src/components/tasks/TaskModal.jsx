import { useState } from "react";
import { ClipboardList, RotateCcw, Trash2, X } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { addDays } from "@/lib/date";
import { describeDeadline } from "@/lib/deadline";
import { STATUS_OPTIONS } from "@/lib/plannerStatus";
import { dangerBtn, ghostBtn, primaryBtn } from "@/lib/buttonStyles";
import Modal from "@/components/ui/Modal";
import SegmentedControl from "@/components/ui/SegmentedControl";

const dateInputClass =
  "rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-sm text-fg outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

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

function DeadlineField({ value, onChange, today, completed }) {
  const chips = [
    { label: "Today", value: today },
    { label: "Tomorrow", value: addDays(today, 1) },
    { label: "Next week", value: addDays(today, 7) },
  ];
  const hint = value ? describeDeadline(value, today, completed) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Deadline"
          className={dateInputClass}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-fg-subtle transition hover:text-fg"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChange(chip.value)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              value === chip.value
                ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                : "border-white/10 text-fg-muted hover:bg-white/5 hover:text-fg"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <p
        className={`mt-2 text-xs ${
          hint?.tone === "red" ? "text-amber-300" : "text-fg-subtle"
        }`}
      >
        {hint
          ? hint.label
          : "No deadline. This task can wait until you're ready."}
      </p>
    </div>
  );
}

// task = null means "create a new task"
export default function TaskModal({ task, today, onClose, onDelete }) {
  const isEdit = Boolean(task);

  // Snapshot of what was saved when the modal opened (used by Reset and the dirty check)
  const [initial] = useState(() => ({
    title: task?.task_title ?? "",
    description: task?.task_description ?? "",
    deadline: task?.deadline ?? "",
    status: task?.status ?? "pending",
  }));

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [deadline, setDeadline] = useState(initial.deadline);
  const [status, setStatus] = useState(initial.status);
  const [error, setError] = useState("");
  const [confirmingClose, setConfirmingClose] = useState(false);

  const create = useCreateTask();
  const update = useUpdateTask();
  const saving = create.isPending || update.isPending;

  const trimmedTitle = title.trim();
  const dirty =
    trimmedTitle !== initial.title ||
    description !== initial.description ||
    deadline !== initial.deadline ||
    status !== initial.status;
  const canSave = dirty && trimmedTitle !== "" && !saving;

  const reset = () => {
    setTitle(initial.title);
    setDescription(initial.description);
    setDeadline(initial.deadline);
    setStatus(initial.status);
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
        if (trimmedTitle !== initial.title) changes.task_title = trimmedTitle;
        if (description !== initial.description)
          changes.task_description = description;
        if (deadline !== initial.deadline) changes.deadline = deadline || null;
        if (status !== initial.status) changes.status = status;

        if (Object.keys(changes).length === 0) {
          onClose();
          return;
        }
        await update.mutateAsync({ id: task.task_id, ...changes });
      } else {
        await create.mutateAsync({
          task_title: trimmedTitle,
          task_description: description,
          ...(deadline ? { deadline } : {}),
        });
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

  return (
    <Modal onClose={requestClose} label={isEdit ? "Edit task" : "New task"}>
      <div className="flex max-h-[90vh] flex-col" onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
            <ClipboardList size={14} className="text-brand-300" />
            {isEdit ? "Edit task" : "New task"}
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
              placeholder="What needs to get done?"
              aria-label="Task title"
              className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-fg-subtle"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              placeholder="Add details (optional)"
              aria-label="Task details"
              className="mt-2 h-28 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-fg-subtle"
            />
          </div>

          <Field label="Deadline (optional)">
            <DeadlineField
              value={deadline}
              onChange={setDeadline}
              today={today}
              completed={status === "completed"}
            />
          </Field>

          {isEdit && (
            <Field label="Status">
              <SegmentedControl
                label="Status"
                value={status}
                onChange={setStatus}
                options={STATUS_OPTIONS}
              />
            </Field>
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
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                {isEdit && (
                  <button
                    onClick={() => onDelete(task)}
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
                  {saving ? "Saving…" : isEdit ? "Save" : "Add task"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
