import { Link } from "react-router";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import HeroMockup from "./HeroMockup";

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 600], [0, 120]);
  const blobY2 = useTransform(scrollY, [0, 600], [0, -80]);

  // Pointer position: normalised (-0.5..0.5) for the 3D scene, pixels for the spotlight
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useMotionValue(640);
  const my = useMotionValue(280);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(99,102,241,0.16), transparent 65%)`;

  const handleMove = (e) => {
    if (reduce || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative isolate overflow-hidden pb-32 pt-28 sm:pt-36 lg:pb-44"
    >
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-dots" />
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="absolute -left-32 -top-32 -z-10 size-[28rem] rounded-full bg-brand-600/30 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: blobY2 }}
        className="absolute -right-32 top-32 -z-10 size-[28rem] rounded-full bg-violet-600/25 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-canvas"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-300">
              <Sparkles size={14} />
              Your all-in-one productivity workspace
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Plan your day.{" "}
              <span className="bg-linear-to-r from-brand-300 to-violet-400 bg-clip-text text-transparent">
                Track your progress.
              </span>{" "}
              Get more done.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              A daily planner, tasks, notes, a calendar and a progress dashboard
              in one place, built to show how you really spend your time.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-500"
              >
                Get started
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-fg transition hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
              {[
                "Plan today or tomorrow",
                "Track real time spent",
                "See your progress",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <HeroMockup px={px} py={py} />
      </div>
    </section>
  );
}
