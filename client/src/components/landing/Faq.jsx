import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const items = [
  {
    q: "What is the difference between the Daily Planner and Tasks?",
    a: "The Daily Planner is for what you will do today or tomorrow, with time allotted and tracked. Tasks are for anything further ahead, with an optional deadline and a status that moves from pending to completed.",
  },
  {
    q: "Can I plan tasks for any date in the Daily Planner?",
    a: "The planner accepts today and tomorrow only, which keeps it focused on real days. For later dates, use Tasks or put an event on the Calendar.",
  },
  {
    q: "What is an extra task?",
    a: "An extra task is something you did that you had not planned. You add it at the end of the day with the time you actually spent, and it counts toward your productive time.",
  },
  {
    q: "How is my progress calculated?",
    a: "Completion is the share of your planned tasks that you finished. Productive time is the total time you logged, including extra tasks, and your streak counts consecutive days with logged time.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Every account only sees its own notes, tasks, plans and events, and passwords are stored hashed, never in plain text.",
  },
  {
    q: "What is the AI Assistant?",
    a: "It is a feature in development that will use your progress to suggest better plans. The planner, tasks, notes, calendar and dashboard work on their own without it.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />

        <Reveal className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-xl border border-slate-200 bg-white"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium sm:text-base"
                >
                  {item.q}
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
