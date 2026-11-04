import { Trash2 } from "lucide-react";
import { accentFor } from "@/lib/noteAccent";
import { timeAgo } from "@/lib/time";

export default function NoteCard({ note, onOpen, onDelete }) {
  const accent = accentFor(note.note_id);

  return (
    <article
      className={`group relative flex min-h-44 flex-col rounded-2xl border border-white/10 bg-surface transition-colors ${accent.hover}`}
    >
      {/* Makes the whole card clickable */}
      <button
        type="button"
        onClick={() => onOpen(note)}
        aria-label={`Open note: ${note.note_title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      />

      <div className="pointer-events-none flex flex-1 flex-col p-5">
        <div className="flex items-start gap-2.5 pr-8">
          <span
            className={`mt-1.5 size-2 shrink-0 rounded-full ${accent.dot}`}
          />
          <h3 className="line-clamp-2 font-semibold leading-snug">
            {note.note_title}
          </h3>
        </div>

        {note.note_description ? (
          <p className="mt-3 line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
            {note.note_description}
          </p>
        ) : (
          <p className="mt-3 text-sm italic text-fg-subtle">No content</p>
        )}

        <p className="mt-auto pt-4 text-xs text-fg-subtle">
          {timeAgo(note.updated_at ?? note.created_at)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDelete(note)}
        aria-label={`Delete note: ${note.note_title}`}
        className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-fg-subtle/70 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
      >
        <Trash2 size={16} />
      </button>
    </article>
  );
}
