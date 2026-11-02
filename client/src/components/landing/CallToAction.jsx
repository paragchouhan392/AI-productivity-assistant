import { Link } from "react-router";
import Reveal from "./Reveal";

export default function CallToAction() {
  return (
    <section className="px-4 py-24">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 to-violet-600 px-6 py-16 text-center text-white shadow-2xl shadow-brand-600/30">
          <div
            aria-hidden
            className="absolute -left-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -right-10 size-72 rounded-full bg-white/10 blur-2xl"
          />

          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to take control of your days?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-brand-100">
            Create your account and plan your first day in a couple of minutes.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              Create your account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
