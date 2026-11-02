import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Sparkles } from "lucide-react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#showcase", label: "Preview" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-canvas/70 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-brand-500 to-violet-500 text-white shadow-lg shadow-brand-600/30">
            <Sparkles size={16} />
          </span>
          AI Productivity
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-fg-muted transition hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition hover:bg-white/5 hover:text-fg"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
          >
            Get started
          </Link>
        </div>
      </div>

      <motion.div
        style={{ scaleX: progress }}
        className="h-0.5 origin-left bg-brand-500"
      />
    </header>
  );
}
