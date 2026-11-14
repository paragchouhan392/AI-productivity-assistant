export const EVENT_TYPES = {
  meeting: {
    label: "Meeting",
    dot: "bg-sky-400",
    chip: "border-sky-400/25 bg-sky-500/15 text-sky-100",
    pill: "blue",
  },
  task: {
    label: "Task",
    dot: "bg-brand-400",
    chip: "border-brand-400/25 bg-brand-500/15 text-brand-100",
    pill: "violet",
  },
  reminder: {
    label: "Reminder",
    dot: "bg-amber-400",
    chip: "border-amber-400/25 bg-amber-500/15 text-amber-100",
    pill: "amber",
  },
  personal: {
    label: "Personal",
    dot: "bg-emerald-400",
    chip: "border-emerald-400/25 bg-emerald-500/15 text-emerald-100",
    pill: "green",
  },
  other: {
    label: "Other",
    dot: "bg-slate-400",
    chip: "border-white/15 bg-white/10 text-fg",
    pill: "slate",
  },
};

export const EVENT_TYPE_LIST = Object.entries(EVENT_TYPES).map(([value, meta]) => ({
  value,
  ...meta,
}));

export const DEFAULT_EVENT_TYPE = "other";