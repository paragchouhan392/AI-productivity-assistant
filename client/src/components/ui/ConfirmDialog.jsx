import { Trash2 } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  loading = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      label={title}
      size="max-w-sm"
      zIndex="z-[60]"
      onClose={loading ? () => {} : onCancel}
    >
      <div className="p-6">
        <div className="mb-4 grid size-10 place-items-center rounded-full bg-red-500/10 text-red-400">
          <Trash2 size={18} />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{message}</p>

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
            autoFocus
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
