import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-5xl font-semibold text-fg-subtle">404</h1>
        <p className="mt-2 text-fg-muted">This page doesn't exist.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-brand-400 hover:underline"
        >
          Back to the app
        </Link>
      </div>
    </div>
  );
}
