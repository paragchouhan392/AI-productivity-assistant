import MockHeatmap from "./MockHeatmap";

const card =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-brand-600/10";

const tones = {
  green: "bg-emerald-50 text-emerald-700",
  blue: "bg-sky-50 text-sky-700",
  slate: "bg-slate-100 text-slate-600",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
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
          <p className="text-xs text-slate-500">Planned tasks</p>
        </div>
        <Pill tone="violet">3 planned</Pill>
      </div>

      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.title}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.title}</p>
              <p className="text-xs text-slate-500">
                Planned {row.planned} · Actual {row.actual}
              </p>
            </div>
            <Pill tone={row.tone}>{row.status}</Pill>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Helped a friend debug</p>
          <p className="text-xs text-slate-500">Unplanned · Actual 00:40</p>
        </div>
        <Pill tone="violet">Extra</Pill>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-center">
        <div>
          <p className="text-lg font-semibold">04:30</p>
          <p className="text-xs text-slate-500">Planned time</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-brand-600">03:35</p>
          <p className="text-xs text-slate-500">Productive time</p>
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
            <li
              key={task.title}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <p className="text-xs text-slate-500">{task.due}</p>
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
            className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 shadow-lg shadow-amber-500/10"
          >
            <p className="text-sm font-semibold">{title}</p>
            <div className="mt-3 space-y-2" aria-hidden>
              <div className="h-2 rounded bg-amber-200/70" />
              <div className="h-2 w-5/6 rounded bg-amber-200/70" />
              <div
                className={`h-2 rounded bg-amber-200/70 ${i === 0 ? "w-2/3" : "w-3/4"}`}
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
    5: "bg-brand-500",
    12: "bg-emerald-500",
    18: "bg-amber-500",
    25: "bg-rose-500",
  };

  return (
    <div className={card}>
      <p className="mb-4 text-sm font-semibold">{monthLabel}</p>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400">
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
                  : "text-slate-700"
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

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <div>
            <p className="text-sm font-medium">Project review</p>
            <p className="text-xs text-slate-500">15:30</p>
          </div>
          <Pill tone="blue">Meeting</Pill>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <div>
            <p className="text-sm font-medium">Submit report</p>
            <p className="text-xs text-slate-500">All day</p>
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
          <div key={tile.label} className="rounded-xl bg-slate-50 p-3">
            <p className="text-lg font-semibold">{tile.value}</p>
            <p className="text-[11px] text-slate-500">{tile.label}</p>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-5 text-xs font-medium text-slate-500">
        Activity heatmap
      </p>
      <div className="overflow-hidden">
        <MockHeatmap weeks={22} cell="size-2.5" />
      </div>

      <p className="mb-2 mt-5 text-xs font-medium text-slate-500">
        Planned vs actual time, last 7 days
      </p>
      <div className="flex h-24 items-end gap-3" aria-hidden>
        {bars.map(([planned, actual], i) => (
          <div key={i} className="flex h-full flex-1 items-end gap-1">
            <div
              className="flex-1 rounded-t bg-slate-200"
              style={{ height: `${planned}%` }}
            />
            <div
              className="flex-1 rounded-t bg-brand-500"
              style={{ height: `${actual}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-slate-200" /> Planned
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-brand-500" /> Actual
        </span>
      </div>
    </div>
  );
}
