import { NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  ListTodo,
  ClipboardList,
  StickyNote,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Daily Planner", icon: ListTodo },
  { to: "/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function AppLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <div className="px-3 pb-6 pt-2 text-lg font-semibold text-brand-600">
          AI Productivity
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 pt-4">
          <p className="truncate px-3 text-sm font-medium">{user.user_name}</p>
          <p className="truncate px-3 pb-3 text-xs text-slate-500">
            {user.email}
          </p>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center gap-2 border-b border-slate-200 bg-white p-2 md:hidden">
          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={logout}
            aria-label="Log out"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={18} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
