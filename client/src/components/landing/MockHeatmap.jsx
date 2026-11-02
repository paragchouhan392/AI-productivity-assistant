const levelClass = [
  "bg-white/5",
  "bg-brand-500/25",
  "bg-brand-500/50",
  "bg-brand-500",
  "bg-brand-300",
];

export default function MockHeatmap({ weeks = 20, cell = "size-3" }) {
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const v = (i * 37 + Math.floor(i / 7) * 11) % 10;
    return v < 3 ? 0 : v < 5 ? 1 : v < 7 ? 2 : v < 9 ? 3 : 4;
  });

  return (
    <div aria-hidden className="grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((level, i) => (
        <span
          key={i}
          className={`${cell} rounded-[3px] ${levelClass[level]}`}
        />
      ))}
    </div>
  );
}
