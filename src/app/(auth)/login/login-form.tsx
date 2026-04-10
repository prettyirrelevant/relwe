"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { signIn } from "~/lib/auth-client";

interface LoginFormProps {
  redirect: string;
}

export function LoginForm({ redirect }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn.email({
      password,
      email,
    });

    if (authError) {
      setError(authError.message ?? "Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    router.push(redirect);
  }

  const signupHref =
    redirect === "/"
      ? "/signup"
      : `/signup?redirect=${encodeURIComponent(redirect)}`;

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="w-full h-13 px-4 bg-surface border border-border rounded-xl text-text focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="w-full h-13 px-4 bg-surface border border-border rounded-xl text-text focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          id="password"
          required
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        className="h-14 mt-2 bg-accent text-text font-heading text-lg rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-sm"
        disabled={loading}
        type="submit"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link className="text-primary underline underline-offset-4" href={signupHref}>
          Sign up
        </Link>
      </p>
    </form>
  );
}
