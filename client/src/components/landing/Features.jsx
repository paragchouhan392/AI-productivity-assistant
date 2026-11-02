import {
  Activity,
  CalendarDays,
  ClipboardList,
  ListTodo,
  Sparkles,
  StickyNote,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";

const features = [
  {
    icon: ListTodo,
    title: "Daily Planner",
    text: "Plan today or tomorrow, allot time in simple HH:MM, then log the time you actually spent. Did something unplanned? Add it as an extra task.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: ClipboardList,
    title: "Tasks & Reminders",
    text: "Capture things for the future, with or without a deadline, and move them from pending to in progress to completed.",
    color: "from-sky-500 to-cyan-500",
  },
  {
    icon: StickyNote,
    title: "Notes",
    text: "Write down ideas, study notes and anything worth keeping, and search through them whenever you need.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: CalendarDays,
    title: "Calendar & Events",
    text: "Schedule meetings, tasks and reminders on any date, and see what is coming up in a clear month view.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Activity,
    title: "Progress Dashboard",
    text: "A heatmap, trend charts, streaks and planned-vs-actual time show how consistent you really are.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    text: "An assistant that looks at your progress and helps you plan smarter days.",
    color: "from-violet-500 to-fuchsia-500",
    soon: true,
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to run your day"
          subtitle="Six tools that work together, so planning, doing and reviewing all happen in one place."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, color, soon }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08} className="h-full">
              <TiltCard className="h-full rounded-2xl border border-white/10 bg-surface p-6 transition-all hover:border-brand-500/40 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.4)]">
                <div
                  style={{ transform: "translateZ(40px)" }}
                  className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-linear-to-br ${color} text-white shadow-lg shadow-black/40`}
                >
                  <Icon size={22} />
                </div>
                <h3
                  style={{ transform: "translateZ(24px)" }}
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  {title}
                  {soon && (
                    <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-300">
                      Coming soon
                    </span>
                  )}
                </h3>
                <p
                  style={{ transform: "translateZ(12px)" }}
                  className="mt-2 text-sm leading-relaxed text-fg-muted"
                >
                  {text}
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
