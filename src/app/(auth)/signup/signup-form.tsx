"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { signUp } from "~/lib/auth-client";

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nin, setNin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (nin.length !== 11 || !/^\d+$/.test(nin)) {
      setError("NIN must be exactly 11 digits.");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp.email({
      password,
      email,
      phone,
      name,
      nin,
    } as Parameters<typeof signUp.email>[0]);

    if (authError) {
      setError(authError.message ?? "Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="name">
          Full name
        </label>
        <input
          className="w-full h-13 px-4 bg-surface border border-border rounded-xl text-text focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          id="name"
          required
        />
      </div>

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
        <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="phone">
          Phone number
        </label>
        <div className="flex">
          <span className="flex items-center h-13 px-4 bg-primary text-text-inverse rounded-l-xl text-sm">
            +234
          </span>
          <input
            className="w-full h-13 px-4 bg-surface border border-border border-l-0 rounded-r-xl text-text focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            id="phone"
            type="tel"
            required
          />
        </div>
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
          minLength={8}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="nin">
          NIN
        </label>
        <input
          className="w-full h-13 px-4 bg-surface border border-border rounded-xl text-text placeholder:text-muted/50 focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors"
          onChange={(e) => setNin(e.target.value)}
          placeholder="Any 11-digit number"
          inputMode="numeric"
          pattern="\d{11}"
          maxLength={11}
          type="text"
          value={nin}
          id="nin"
          required
        />
        <p className="text-xs text-muted mt-2">
          Demo only — NIN isn&apos;t verified. Any 11-digit number works.
        </p>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        className="h-14 mt-2 bg-accent text-text font-heading text-lg rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-sm"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="text-primary underline underline-offset-4" href="/login">
          Log in
        </Link>
      </p>
    </form>
  );
}
