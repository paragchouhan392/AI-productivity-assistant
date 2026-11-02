import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/api/client";
import AuthCard from "@/components/ui/AuthCard";
import FormField from "@/components/ui/FormField";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", user_name: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start planning your days"
      footer={
        <>
          Already registered?{" "}
          <Link
            to="/login"
            className="font-medium text-brand-600 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <FormField
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Username"
          id="user_name"
          autoComplete="username"
          hint="3-30 characters: letters, numbers and underscores"
          value={form.user_name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with a letter and a number"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
