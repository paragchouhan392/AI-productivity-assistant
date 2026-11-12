import { Search, X } from "lucide-react";
import SelectField from "@/components/ui/SelectField";

const STATUS_TABS = [
  { value: "", label: "All", key: "total" },
  { value: "pending", label: "Pending", key: "pending" },
  { value: "in_progress", label: "In progress", key: "in_progress" },
  { value: "completed", label: "Completed", key: "completed" },
];

const DUE_OPTIONS = [
  { value: "", label: "Any deadline" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "No deadline" },
];

const SORT_OPTIONS = [
  { value: "deadline", label: "Soonest deadline" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export default function TaskFilters({
  stats,
  status,
  due,
  sort,
  searchInput,
  onStatus,
  onDue,
  onSort,
  onSearch,
}) {
  return (
    <div className="mt-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
        />
        <input
          value={searchInput}
          onChange={(e) => onSearch(e.target.value)}
          maxLength={100}
          placeholder="Search your tasks"
          aria-label="Search tasks"
          className="w-full rounded-xl border border-white/10 bg-surface py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-fg-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        {searchInput && (
          <button
            onClick={() => onSearch("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-fg-subtle transition hover:bg-white/5 hover:text-fg"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status tabs with counts */}
        <div
          className="flex gap-1 overflow-x-auto"
          role="tablist"
          aria-label="Filter by status"
        >
          {STATUS_TABS.map((tab) => {
            const active = status === tab.value;
            const count = stats?.[tab.key];
            return (
              <button
                key={tab.label}
                role="tab"
                aria-selected={active}
                onClick={() => onStatus(tab.value)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-500/15 text-brand-300"
                    : "text-fg-muted hover:bg-white/5 hover:text-fg"
                }`}
              >
                {tab.label}
                {count !== undefined && (
                  <span
                    className={`text-xs tabular-nums ${
                      active ? "text-brand-300/80" : "text-fg-subtle"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <SelectField
            label="Filter by deadline"
            value={due}
            onChange={onDue}
            options={DUE_OPTIONS}
          />
          <SelectField
            label="Sort tasks"
            value={sort}
            onChange={onSort}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
