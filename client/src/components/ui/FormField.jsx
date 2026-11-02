export default function FormField({ label, id, hint, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-fg-muted"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="w-full rounded-lg border border-white/10 bg-surface-2 px-3 py-2 text-sm text-fg outline-none transition placeholder:text-fg-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        {...props}
      />
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}
