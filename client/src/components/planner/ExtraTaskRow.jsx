import { Trash2, Zap } from "lucide-react";
import Pill from "@/components/ui/Pill";
import { formatDuration } from "@/lib/duration";

export default function ExtraTaskRow({ todo, mode, onOpen, onDelete }) {
  return (
    <article className="relative rounded-2xl border border-white/10 bg-surface p-4 transition-colors hover:border-violet-400/40">
      <button
        type="button"
        onClick={() => onOpen(todo)}
        aria-label={`Open extra task: ${todo.todo_title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      />

      <div className="pointer-events-none flex items-start gap-3">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-violet-500/15 text-violet-300">
          <Zap size={14} />
        </span>

        <div className="min-w-0 flex-1 pr-8">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{todo.todo_title}</h3>
            <Pill tone="violet">Extra</Pill>
          </div>

          {todo.todo_description && (
            <p className="mt-1 line-clamp-1 text-sm text-fg-muted">
              {todo.todo_description}
            </p>
          )}

          <p className="mt-2 text-xs text-fg-subtle">
            Spent{" "}
            <span className="font-medium text-fg-muted">
              {formatDuration(todo.actual_minutes)}
            </span>
            {todo.alloted_minutes
              ? ` · Planned ${formatDuration(todo.alloted_minutes)}`
              : ""}
          </p>
        </div>
      </div>

      {mode !== "past" && (
        <button
          type="button"
          onClick={() => onDelete(todo)}
          aria-label={`Delete task: ${todo.todo_title}`}
          className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-fg-subtle/70 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <Trash2 size={16} />
        </button>
      )}
    </article>
  );
}
