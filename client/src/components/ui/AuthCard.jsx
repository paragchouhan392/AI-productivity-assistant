import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div
      className="grid min-h-screen place-items-center px-4 py-10"
      style={{
        backgroundImage:
          "radial-gradient(60rem 40rem at 50% -10%, rgba(99,102,241,0.2), transparent)",
      }}
    >
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-fg"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="rounded-2xl border border-white/10 bg-surface p-8 shadow-[0_30px_80px_-30px_rgba(99,102,241,0.45)]">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-sm text-fg-muted">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
