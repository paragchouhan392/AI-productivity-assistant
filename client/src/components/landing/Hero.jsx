import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import HeroMockup from "./HeroMockup";

export default function Hero() {
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 600], [0, 120]);
  const blobY2 = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-36 lg:pb-32">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-dots" />
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="absolute -left-24 -top-24 -z-10 size-96 rounded-full bg-brand-400/30 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: blobY2 }}
        className="absolute -right-24 top-40 -z-10 size-96 rounded-full bg-violet-400/25 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-sm">
              <Sparkles size={14} />
              Your all-in-one productivity workspace
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Plan your day.{" "}
              <span className="bg-linear-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
                Track your progress.
              </span>{" "}
              Get more done.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              A daily planner, tasks, notes, a calendar and a progress dashboard
              in one place, built to show how you really spend your time.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
              >
                Get started
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Log in
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {[
                "Plan today or tomorrow",
                "Track real time spent",
                "See your progress",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}
