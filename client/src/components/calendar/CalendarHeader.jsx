import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, monthTitle } from "@/lib/calendar";

const iconBtn =
  "grid size-8 place-items-center rounded-lg text-fg-muted transition hover:bg-white/5 hover:text-fg";

// monthStart = "YYYY-MM-01"
export default function CalendarHeader({
  monthStart,
  isCurrentMonth,
  loading,
  onChangeMonth,
  onToday,
}) {
  const inputRef = useRef(null);

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
          onClick={() => onChangeMonth(addMonths(monthStart, -1))}
          aria-label="Previous month"
          className={iconBtn}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={openPicker}
          title="Choose a month"
          className="min-w-44 rounded-lg px-3 py-1.5 text-sm font-semibold transition hover:bg-white/5"
        >
          {monthTitle(monthStart)}
        </button>
        <input
          ref={inputRef}
          type="month"
          value={monthStart.slice(0, 7)}
          tabIndex={-1}
          aria-label="Choose a month"
          className="sr-only"
          onChange={(e) => {
            if (e.target.value) onChangeMonth(`${e.target.value}-01`);
          }}
        />

        <button
          onClick={() => onChangeMonth(addMonths(monthStart, 1))}
          aria-label="Next month"
          className={iconBtn}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {!isCurrentMonth && (
        <button
          onClick={onToday}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
        >
          Today
        </button>
      )}

      {loading && <span className="text-xs text-fg-subtle">Loading…</span>}
    </div>
  );
}
