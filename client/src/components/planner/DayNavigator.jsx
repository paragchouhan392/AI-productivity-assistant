import { useRef } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, dayLabel } from "@/lib/date";

const iconBtn =
  "grid size-8 place-items-center rounded-lg text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:cursor-not-allowed disabled:opacity-30";

// onChange receives a date, or null for "today"
export default function DayNavigator({ viewDate, today, onChange }) {
  const inputRef = useRef(null);
  const tomorrow = addDays(today, 1);

  const go = (date) => onChange(date === today ? null : date);

  const openPicker = () => {
    try {
      inputRef.current?.showPicker?.();
    } catch {
      // older browsers: ignore
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-surface p-1">
        <button
          onClick={() => go(addDays(viewDate, -1))}
          aria-label="Previous day"
          className={iconBtn}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={openPicker}
          className="flex min-w-32 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-white/5"
        >
          <CalendarDays size={15} className="text-fg-subtle" />
          {dayLabel(viewDate, today)}
        </button>
        <input
          ref={inputRef}
          type="date"
          value={viewDate}
          max={tomorrow}
          tabIndex={-1}
          aria-label="Choose a date"
          className="sr-only"
          onChange={(e) => {
            const value = e.target.value;
            if (!value) return;
            go(value > tomorrow ? tomorrow : value);
          }}
        />

        <button
          onClick={() => go(addDays(viewDate, 1))}
          disabled={viewDate >= tomorrow}
          aria-label="Next day"
          className={iconBtn}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {viewDate !== today && (
        <button
          onClick={() => go(today)}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
        >
          Today
        </button>
      )}
    </div>
  );
}
