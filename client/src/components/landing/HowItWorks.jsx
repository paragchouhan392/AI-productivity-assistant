import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    title: "Create your account",
    text: "Sign up with your email in a few seconds and land in your own private workspace.",
  },
  {
    title: "Plan and capture",
    text: "Plan your day, add tasks, jot down notes and put events on your calendar.",
  },
  {
    title: "Track and improve",
    text: "Log the time you spend, watch your dashboard fill up and keep your streak alive.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="how-it-works" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="How it works"
          title="From sign-up to insight in three steps"
        />

        <div ref={ref} className="relative mt-16 grid gap-12 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-0.5 bg-slate-200 md:block"
          >
            <motion.div
              style={{ scaleX }}
              className="h-full origin-left bg-brand-600"
            />
          </div>

          {steps.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 0.1}
              className="relative text-center"
            >
              <div className="relative z-10 mx-auto grid size-14 place-items-center rounded-full border-2 border-brand-600 bg-white text-lg font-bold text-brand-600 shadow-lg shadow-brand-600/10">
                {i + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">
                {step.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
