import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { CalendarDays, Check, Flame } from "lucide-react";
import MockHeatmap from "./MockHeatmap";

function Chip({ z, className, delay = "0s", children }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ transform: `translateZ(${z}px)` }}
    >
      <div
        className="animate-float rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-900/10 motion-reduce:animate-none"
        style={{ animationDelay: delay }}
      >
        {children}
      </div>
    </div>
  );
}

export default function HeroMockup() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 120, damping: 18 };
  const rotateX = useSpring(
    useTransform(
      [py, scrollY],
      ([p, s]) => 16 - p * 10 - (Math.min(s, 500) / 500) * 12,
    ),
    spring,
  );
  const rotateY = useSpring(
    useTransform(px, (p) => -18 + p * 14),
    spring,
  );

  const handleMove = (e) => {
    if (reduce || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  const bars = [40, 65, 50, 85, 60, 95, 70];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="relative mx-auto w-full max-w-xl px-6 py-10"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="relative"
        style={
          reduce
            ? { rotateX: 12, rotateY: -14, transformStyle: "preserve-3d" }
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        {/* Dashboard window */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-600/25">
          <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <span className="size-2.5 rounded-full bg-rose-300" />
            <span className="size-2.5 rounded-full bg-amber-300" />
            <span className="size-2.5 rounded-full bg-emerald-300" />
            <span className="ml-3 h-2 w-28 rounded bg-slate-200" />
          </div>

          <div className="grid grid-cols-[52px_1fr]">
            <div
              className="space-y-3 border-r border-slate-100 p-3"
              aria-hidden
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`size-7 rounded-lg ${i === 0 ? "bg-brand-100" : "bg-slate-100"}`}
                />
              ))}
            </div>

            <div className="space-y-4 p-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["82%", "Completed"],
                  ["12 d", "Streak"],
                  ["24:30", "Focus time"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-base font-semibold">{value}</p>
                    <p className="text-[10px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden">
                <p className="mb-2 text-[11px] font-medium text-slate-500">
                  Activity
                </p>
                <MockHeatmap weeks={15} cell="size-3" />
              </div>

              <div className="flex h-16 items-end gap-2" aria-hidden>
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-brand-500/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards at different depths */}
        <Chip z={90} className="-right-4 -top-8 sm:-right-8">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" className="size-10 -rotate-90" aria-hidden>
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                strokeWidth="4"
                className="stroke-slate-100"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="100.5"
                strokeDashoffset="20"
                className="stroke-brand-600"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold">Today</p>
              <p className="text-xs text-slate-500">4 of 5 tasks done</p>
            </div>
          </div>
        </Chip>

        <Chip z={70} delay="-2s" className="-bottom-8 -left-4 sm:-left-10">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Check size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold">Study DBMS</p>
              <p className="text-xs text-slate-500">
                01:30 planned · 01:45 actual
              </p>
            </div>
          </div>
        </Chip>

        <Chip z={120} delay="-4s" className="-right-2 top-1/2 sm:-right-12">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <p className="text-sm font-semibold">12-day streak</p>
          </div>
        </Chip>

        <Chip z={50} delay="-1s" className="-left-6 top-10 hidden sm:block">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-lg bg-sky-50 text-sky-600">
              <CalendarDays size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold">Project review</p>
              <p className="text-xs text-slate-500">Today · 15:30</p>
            </div>
          </div>
        </Chip>
      </motion.div>
    </motion.div>
  );
}
