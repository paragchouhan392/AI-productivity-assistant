import MockHeatmap from "./MockHeatmap";

const card =
  "rounded-2xl border border-white/10 bg-surface p-5 shadow-[0_30px_80px_-20px_rgba(99,102,241,0.35)]";
const row =
  "flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-3 py-2.5";

const tones = {
  green: "bg-emerald-500/15 text-emerald-300",
  blue: "bg-sky-500/15 text-sky-300",
  slate: "bg-white/10 text-fg-muted",
  violet: "bg-violet-500/15 text-violet-300",
  amber: "bg-amber-500/15 text-amber-300",
};

function Pill({ tone = "slate", children }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PlannerMock() {
  const rows = [
    {
      title: "Study DBMS",
      planned: "01:30",
      actual: "01:45",
      status: "Completed",
      tone: "green",
    },
    {
      title: "Build notes page",
      planned: "02:00",
      actual: "01:10",
      status: "In progress",
      tone: "blue",
    },
    {
      title: "Evening workout",
      planned: "01:00",
      actual: "00:00",
      status: "Pending",
      tone: "slate",
    },
  ];

  return (
    <div className={card}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Today's plan</p>
          <p className="text-xs text-fg-subtle">Planned tasks</p>
        </div>
        <Pill tone="violet">3 planned</Pill>
      </div>

      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.title} className={row}>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{r.title}</p>
              <p className="text-xs text-fg-subtle">
                Planned {r.planned} · Actual {r.actual}
              </p>
            </div>
            <Pill tone={r.tone}>{r.status}</Pill>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-violet-400/30 bg-violet-500/10 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Helped a friend debug</p>
          <p className="text-xs text-fg-subtle">Unplanned · Actual 00:40</p>
        </div>
        <Pill tone="violet">Extra</Pill>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-center">
        <div>
          <p className="text-lg font-semibold">04:30</p>
          <p className="text-xs text-fg-subtle">Planned time</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-brand-300">03:35</p>
          <p className="text-xs text-fg-subtle">Productive time</p>
        </div>
      </div>
    </div>
  );
}

export function TasksNotesMock() {
  const tasks = [
    {
      title: "Submit project report",
      due: "Due Nov 15",
      status: "Pending",
      tone: "slate",
    },
    {
      title: "Learn Docker",
      due: "No deadline",
      status: "In progress",
      tone: "blue",
    },
    {
      title: "Renew library card",
      due: "Due Nov 20",
      status: "Completed",
      tone: "green",
    },
  ];

  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="mb-3 text-sm font-semibold">Upcoming tasks</p>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.title} className={row}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <p className="text-xs text-fg-subtle">{task.due}</p>
              </div>
              <Pill tone={task.tone}>{task.status}</Pill>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {["Project ideas", "DBMS notes"].map((title, i) => (
          <div
            key={title}
            className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 shadow-lg shadow-amber-500/5"
          >
            <p className="text-sm font-semibold">{title}</p>
            <div className="mt-3 space-y-2" aria-hidden>
              <div className="h-2 rounded bg-amber-300/25" />
              <div className="h-2 w-5/6 rounded bg-amber-300/25" />
              <div
                className={`h-2 rounded bg-amber-300/25 ${i === 0 ? "w-2/3" : "w-3/4"}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarMock() {
  const now = new Date();
  const monthLabel = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const firstWeekday = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const today = now.getDate();

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const dots = {
    5: "bg-brand-400",
    12: "bg-emerald-400",
    18: "bg-amber-400",
    25: "bg-rose-400",
  };

  return (
    <div className={card}>
      <p className="mb-4 text-sm font-semibold">{monthLabel}</p>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-fg-subtle">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <span key={i} />
          ) : (
            <div
              key={i}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-xs ${
                day === today
                  ? "bg-brand-600 font-semibold text-white"
                  : "text-fg-muted"
              }`}
            >
              {day}
              {dots[day] && (
                <span
                  className={`mt-0.5 size-1.5 rounded-full ${
                    day === today ? "bg-white" : dots[day]
                  }`}
                />
              )}
            </div>
          ),
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-line pt-4">
        <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
          <div>
            <p className="text-sm font-medium">Project review</p>
            <p className="text-xs text-fg-subtle">15:30</p>
          </div>
          <Pill tone="blue">Meeting</Pill>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
          <div>
            <p className="text-sm font-medium">Submit report</p>
            <p className="text-xs text-fg-subtle">All day</p>
          </div>
          <Pill tone="amber">Reminder</Pill>
        </div>
      </div>
    </div>
  );
}

export function DashboardMock() {
  const tiles = [
    { label: "Completion", value: "82%" },
    { label: "Streak", value: "12 days" },
    { label: "This week", value: "24:30" },
  ];
  const bars = [
    [60, 50],
    [70, 75],
    [55, 40],
    [80, 90],
    [65, 60],
    [90, 85],
    [50, 45],
  ];

  return (
    <div className={card}>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl bg-surface-2 p-3">
            <p className="text-lg font-semibold">{tile.value}</p>
            <p className="text-[11px] text-fg-subtle">{tile.label}</p>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-5 text-xs font-medium text-fg-subtle">
        Activity heatmap
      </p>
      <div className="overflow-hidden">
        <MockHeatmap weeks={22} cell="size-2.5" />
      </div>

      <p className="mb-2 mt-5 text-xs font-medium text-fg-subtle">
        Planned vs actual time, last 7 days
      </p>
      <div className="flex h-24 items-end gap-3" aria-hidden>
        {bars.map(([planned, actual], i) => (
          <div key={i} className="flex h-full flex-1 items-end gap-1">
            <div
              className="flex-1 rounded-t bg-white/15"
              style={{ height: `${planned}%` }}
            />
            <div
              className="flex-1 rounded-t bg-brand-500"
              style={{ height: `${actual}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-[11px] text-fg-subtle">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-white/15" /> Planned
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-brand-500" /> Actual
        </span>
      </div>
    </div>
  );
}
