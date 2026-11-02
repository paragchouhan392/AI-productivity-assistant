import { Check } from "lucide-react";
import Reveal from "./Reveal";
import ScrollTilt from "./ScrollTilt";
import SectionHeading from "./SectionHeading";
import {
  CalendarMock,
  DashboardMock,
  PlannerMock,
  TasksNotesMock,
} from "./mocks";

function ShowcaseRow({ index, eyebrow, title, text, points, children }) {
  const reversed = index % 2 === 1;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal className={reversed ? "lg:order-2" : ""}>
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 text-fg-muted">{text}</p>
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-sm text-fg-muted"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                <Check size={12} strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </Reveal>

      <ScrollTilt direction={reversed ? 1 : -1}>{children}</ScrollTilt>
    </div>
  );
}

export default function Showcases() {
  return (
    <section
      id="showcase"
      className="scroll-mt-20 border-y border-white/5 bg-surface/50 py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="A closer look"
          title="Built around how your day really goes"
          subtitle="From the morning plan to the evening review, every part of the app has one job and does it well."
        />

        <div className="mt-20 space-y-28">
          <ShowcaseRow
            index={0}
            eyebrow="Daily Planner"
            title="Plan the day, then see what really happened"
            text="Decide what you want to do today (or tomorrow), give each task some time, and record how long it actually took."
            points={[
              "Plan tasks for today or the day before",
              "Allot time in simple HH:MM format",
              "Log actual time: less, equal or more than planned",
              "Add extra tasks you did but never planned",
            ]}
          >
            <PlannerMock />
          </ShowcaseRow>

          <ShowcaseRow
            index={1}
            eyebrow="Tasks & Notes"
            title="Keep future plans and ideas out of your head"
            text="For things that are not part of today, use tasks with optional deadlines, and keep your thoughts in searchable notes."
            points={[
              "Add tasks for any future date, or with no deadline at all",
              "Track progress from pending to in progress to completed",
              "Write and search notes in one place",
              "Everything is private to your account",
            ]}
          >
            <TasksNotesMock />
          </ShowcaseRow>

          <ShowcaseRow
            index={2}
            eyebrow="Calendar & Events"
            title="Never miss a meeting or a reminder"
            text="Pick a date on the calendar and add anything you want to remember, from meetings to personal reminders."
            points={[
              "Click any date to add an event",
              "Choose a time, or keep it as an all-day event",
              "Label events as meetings, tasks, reminders and more",
              "See what is coming up in the next few days",
            ]}
          >
            <CalendarMock />
          </ShowcaseRow>

          <ShowcaseRow
            index={3}
            eyebrow="Progress Dashboard"
            title="See your consistency, not just your to-do list"
            text="Your dashboard turns the time you log into clear visuals, so you can spot patterns and keep improving."
            points={[
              "An activity heatmap of your productive days",
              "Trend charts for the last 7, 30 or 90 days",
              "Streaks that reward showing up every day",
              "Planned vs actual time, to plan more realistically",
            ]}
          >
            <DashboardMock />
          </ShowcaseRow>
        </div>
      </div>
    </section>
  );
}
