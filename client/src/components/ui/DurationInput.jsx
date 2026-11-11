import { formatDuration, MAX_MINUTES } from "@/lib/duration";

const clamp = (value, max) => {
  const n = Math.floor(Number(value));
  return Number.isNaN(n) ? 0 : Math.min(max, Math.max(0, n));
};

const boxClass =
  "w-16 rounded-lg border border-white/10 bg-surface-2 px-2 py-2 text-center text-lg font-semibold tabular-nums outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export default function DurationInput({
  value,
  onChange,
  disabled = false,
  presets = [15, 30, 60, 90, 120],
  label = "Duration",
}) {
  const total = Math.min(value ?? 0, MAX_MINUTES);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  return (
    <div role="group" aria-label={label}>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={23}
          value={hours}
          disabled={disabled}
          aria-label="Hours"
          onFocus={(e) => e.target.select()}
          onChange={(e) => onChange(clamp(e.target.value, 23) * 60 + minutes)}
          className={boxClass}
        />
        <span className="text-sm text-fg-subtle">h</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          value={minutes}
          disabled={disabled}
          aria-label="Minutes"
          onFocus={(e) => e.target.select()}
          onChange={(e) => onChange(hours * 60 + clamp(e.target.value, 59))}
          className={boxClass}
        />
        <span className="text-sm text-fg-subtle">m</span>
      </div>

      {!disabled && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                total === preset
                  ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                  : "border-white/10 text-fg-muted hover:bg-white/5 hover:text-fg"
              }`}
            >
              {formatDuration(preset)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
