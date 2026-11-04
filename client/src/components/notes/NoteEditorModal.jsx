import { useState } from "react";
import { RotateCcw, Trash2, X } from "lucide-react";
import { getErrorMessage } from "@/api/client";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { accentFor } from "@/lib/noteAccent";
import { timeAgo } from "@/lib/time";
import Modal from "@/components/ui/Modal";

const ghostBtn =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40";
const primaryBtn =
  "rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40";
const dangerBtn =
  "rounded-lg bg-red-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500";

// note = null means "create a new note"
export default function NoteEditorModal({ note, onClose, onDelete }) {
  // Snapshot of what was saved when the modal opened (used by Reset and the dirty check)
  const [initial] = useState(() => ({
    title: note?.note_title ?? "",
    description: note?.note_description ?? "",
  }));

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [error, setError] = useState("");
  const [confirmingClose, setConfirmingClose] = useState(false);

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const saving = createNote.isPending || updateNote.isPending;

  const dirty = title !== initial.title || description !== initial.description;
  const hasContent = title.trim() !== "" || description.trim() !== "";
  const canSave = dirty && hasContent && !saving;

  const reset = () => {
    setTitle(initial.title);
    setDescription(initial.description);
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

    const payload = {
      note_title: title.trim() || "Untitled note",
      note_description: description,
    };

    try {
      if (note) {
        await updateNote.mutateAsync({ id: note.note_id, ...payload });
      } else {
        await createNote.mutateAsync(payload);
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
    <Modal onClose={requestClose} label={note ? "Edit note" : "New note"}>
      <div className="flex max-h-[90vh] flex-col" onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
            <span
              className={`size-2 rounded-full ${
                note ? accentFor(note.note_id).dot : "bg-brand-400"
              }`}
            />
            {note
              ? `Edited ${timeAgo(note.updated_at ?? note.created_at)}`
              : "New note"}
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
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="Title"
            aria-label="Note title"
            className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-fg-subtle"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={10000}
            placeholder="Start writing…"
            aria-label="Note content"
            className="h-[45vh] w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-fg-subtle"
          />
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
              <div className="flex items-center gap-3 text-xs text-fg-subtle">
                {note && (
                  <button
                    onClick={() => onDelete(note)}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                )}
                <span>{description.length.toLocaleString()} / 10,000</span>
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
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
