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

// A layer placed at depth `z`. Layers move closer together as the page scrolls.
function Layer({ z, depth, className = "", children }) {
  const depthZ = useTransform(depth, (d) => z * d);
  return (
    <motion.div
      className={`preserve-3d absolute ${className}`}
      style={{ z: depthZ }}
    >
      {children}
    </motion.div>
  );
}

// A glowing glass cube that floats and spins in 3D
function Cube({ size = 48 }) {
  const half = size / 2;
  const faces = [
    "rotateY(0deg)",
    "rotateY(90deg)",
    "rotateY(180deg)",
    "rotateY(-90deg)",
    "rotateX(90deg)",
    "rotateX(-90deg)",
  ];

  return (
    <div className="preserve-3d animate-float motion-reduce:animate-none">
      <div
        className="preserve-3d relative animate-spin3d motion-reduce:animate-none"
        style={{ width: size, height: size }}
      >
        {faces.map((face) => (
          <span
            key={face}
            className="absolute inset-0 rounded-md border border-brand-300/50 bg-linear-to-br from-brand-500/30 to-violet-500/20 shadow-[inset_0_0_18px_rgba(165,180,252,0.45)]"
            style={{ transform: `${face} translateZ(${half}px)` }}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({ children, delay = "0s" }) {
  return (
    <div
      className="animate-float rounded-xl border border-white/10 bg-surface p-3 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.5)] motion-reduce:animate-none"
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

export default function HeroMockup({ px, py }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const staticDepth = useMotionValue(1);

  const spring = { stiffness: 90, damping: 18 };
  const rotateX = useSpring(
    useTransform(
      [py, scrollY],
      ([p, s]) => 18 - p * 16 - (Math.min(s, 600) / 600) * 14,
    ),
    spring,
  );
  const rotateY = useSpring(
    useTransform(px, (p) => -22 + p * 24),
    spring,
  );
  const scrollDepth = useTransform(scrollY, [0, 600], [1, 0.25]);
  const sceneY = useTransform(scrollY, [0, 600], [0, -50]);

  const depth = reduce ? staticDepth : scrollDepth;
  const bars = [40, 65, 50, 85, 60, 95, 70];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      className="relative mx-auto w-full max-w-xl px-8 py-12"
      style={{ perspective: 1600, perspectiveOrigin: "50% 30%" }}
    >
      <motion.div
        className="preserve-3d relative"
        style={{
          rotateX: reduce ? 14 : rotateX,
          rotateY: reduce ? -18 : rotateY,
          y: reduce ? 0 : sceneY,
        }}
      >
        {/* Stage floor: a receding perspective grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full h-[420px] w-[180%]"
          style={{
            transform: "translateX(-50%) translateZ(-60px) rotateX(78deg)",
            transformOrigin: "top center",
            backgroundImage:
              "linear-gradient(rgba(129,140,248,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.35) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 50% 0%, black 10%, transparent 68%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 0%, black 10%, transparent 68%)",
          }}
        />

        {/* Glow where the stack meets the floor */}
        <Layer
          z={-30}
          depth={depth}
          className="left-1/2 top-full h-10 w-3/4 -translate-x-1/2"
        >
          <div className="size-full rounded-full bg-brand-500/50 blur-2xl" />
        </Layer>

        {/* Stacked panels behind the window */}
        <Layer z={-170} depth={depth} className="inset-0">
          <div className="size-full translate-x-10 -translate-y-10 rounded-2xl border border-white/5 bg-linear-to-br from-violet-500/15 to-brand-500/5" />
        </Layer>
        <Layer z={-85} depth={depth} className="inset-0">
          <div className="size-full translate-x-5 -translate-y-5 space-y-3 rounded-2xl border border-white/10 bg-linear-to-br from-brand-500/25 to-violet-500/10 p-4">
            <div className="h-2 w-1/3 rounded bg-white/15" />
            <div className="h-2 w-2/3 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/10" />
          </div>
        </Layer>

        {/* Main dashboard window */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_40px_120px_-20px_rgba(99,102,241,0.55)] ring-1 ring-white/5">
          <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-4 py-3">
            <span className="size-2.5 rounded-full bg-rose-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 h-2 w-28 rounded bg-white/10" />
          </div>

          <div className="grid grid-cols-[52px_1fr]">
            <div className="space-y-3 border-r border-line p-3" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`size-7 rounded-lg ${i === 0 ? "bg-brand-500/30" : "bg-white/5"}`}
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
                  <div key={label} className="rounded-xl bg-surface-2 p-3">
                    <p className="text-base font-semibold">{value}</p>
                    <p className="text-[10px] text-fg-subtle">{label}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden">
                <p className="mb-2 text-[11px] font-medium text-fg-subtle">
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

        {/* Floating cards in front of the window */}
        <Layer z={110} depth={depth} className="-right-6 -top-10 sm:-right-10">
          <Chip>
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 40 40"
                className="size-10 -rotate-90"
                aria-hidden
              >
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  strokeWidth="4"
                  className="stroke-white/10"
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
                  className="stroke-brand-400"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold">Today</p>
                <p className="text-xs text-fg-subtle">4 of 5 tasks done</p>
              </div>
            </div>
          </Chip>
        </Layer>

        <Layer z={80} depth={depth} className="-bottom-10 -left-4 sm:-left-12">
          <Chip delay="-2s">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <Check size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold">Study DBMS</p>
                <p className="text-xs text-fg-subtle">
                  01:30 planned · 01:45 actual
                </p>
              </div>
            </div>
          </Chip>
        </Layer>

        <Layer z={170} depth={depth} className="-right-2 top-1/2 sm:-right-14">
          <Chip delay="-4s">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-400" />
              <p className="text-sm font-semibold">12-day streak</p>
            </div>
          </Chip>
        </Layer>

        <Layer z={60} depth={depth} className="-left-8 top-10 hidden sm:block">
          <Chip delay="-1s">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-sky-500/15 text-sky-300">
                <CalendarDays size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold">Project review</p>
                <p className="text-xs text-fg-subtle">Today · 15:30</p>
              </div>
            </div>
          </Chip>
        </Layer>

        {/* 3D cubes at different depths */}
        <Layer z={190} depth={depth} className="-left-10 top-[30%]">
          <Cube size={44} />
        </Layer>
        <Layer z={240} depth={depth} className="-right-4 bottom-[12%]">
          <Cube size={32} />
        </Layer>
        <Layer z={130} depth={depth} className="right-[24%] -top-14">
          <Cube size={26} />
        </Layer>
      </motion.div>
    </motion.div>
  );
}
