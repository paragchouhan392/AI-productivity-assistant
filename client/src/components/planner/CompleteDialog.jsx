import { useState } from "react";
import { Check } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import { useUpdateTodo } from "@/hooks/usePlanner";
import { formatDuration, toHHMM } from "@/lib/duration";
import Modal from "@/components/ui/Modal";
import DurationInput from "@/components/ui/DurationInput";
import { ghostBtn, primaryBtn } from "@/lib/buttonStyles";

export default function CompleteDialog({ todo, onClose }) {
  const planned = todo.alloted_minutes ?? 0;
  const [actual, setActual] = useState(
    todo.actual_minutes > 0 ? todo.actual_minutes : planned || 30,
  );
  const [error, setError] = useState("");
  const update = useUpdateTodo();

  const diff = actual - planned;

  const submit = async (e) => {
    e.preventDefault();
    if (actual <= 0) return;
    setError("");

    try {
      await update.mutateAsync({
        id: todo.daily_task_id,
        actual_time: toHHMM(actual),
        status: "completed",
      });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal
      label="Complete task"
      size="max-w-md"
      onClose={update.isPending ? () => {} : onClose}
    >
      <form onSubmit={submit} className="p-6">
        <div className="mb-4 grid size-10 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
          <Check size={20} strokeWidth={3} />
        </div>

        <h2 className="text-lg font-semibold">How long did it take?</h2>
        <p className="mt-1 truncate text-sm text-fg-muted">{todo.todo_title}</p>

        <div className="mt-5">
          <DurationInput
            value={actual}
            onChange={setActual}
            label="Time spent"
          />
        </div>

        <p className="mt-3 text-xs text-fg-subtle">
          Planned {formatDuration(planned)}
          {actual > 0 && (
            <span className={diff > 0 ? "text-amber-300" : "text-emerald-300"}>
              {" · "}
              {diff === 0
                ? "exactly as planned"
                : `${formatDuration(Math.abs(diff))} ${diff > 0 ? "over" : "under"} plan`}
            </span>
          )}
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={update.isPending}
            className={ghostBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={actual <= 0 || update.isPending}
            className={primaryBtn}
          >
            {update.isPending ? "Saving…" : "Mark as completed"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
