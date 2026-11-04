const accents = [
  { dot: "bg-indigo-400", hover: "hover:border-indigo-400/40" },
  { dot: "bg-emerald-400", hover: "hover:border-emerald-400/40" },
  { dot: "bg-amber-400", hover: "hover:border-amber-400/40" },
  { dot: "bg-rose-400", hover: "hover:border-rose-400/40" },
  { dot: "bg-sky-400", hover: "hover:border-sky-400/40" },
  { dot: "bg-violet-400", hover: "hover:border-violet-400/40" },
];

export const accentFor = (id) => accents[Number(id) % accents.length];