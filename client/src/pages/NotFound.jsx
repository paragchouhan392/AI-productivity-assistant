import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-5xl font-semibold text-slate-300">404</h1>
        <p className="mt-2 text-slate-600">This page doesn't exist.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          Back to the app
        </Link>
      </div>
    </div>
  );
}
