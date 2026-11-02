import { Link } from "react-router";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-brand-500 to-violet-500 text-white">
            <Sparkles size={14} />
          </span>
          AI Productivity
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          <a href="#features" className="hover:text-slate-900">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-slate-900">
            How it works
          </a>
          <a href="#faq" className="hover:text-slate-900">
            FAQ
          </a>
          <Link to="/login" className="hover:text-slate-900">
            Log in
          </Link>
          <Link to="/register" className="hover:text-slate-900">
            Register
          </Link>
        </nav>

        <p>© {new Date().getFullYear()} AI Productivity Assistant</p>
      </div>
    </footer>
  );
}
