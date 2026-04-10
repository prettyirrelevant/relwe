import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in — Rélwè",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect = "/" } = await searchParams;

  return (
    <div>
      <h1 className="font-heading text-[32px] text-primary mb-2">
        Welcome back
      </h1>
      <p className="text-muted mb-8">
        Log in to book your next train ride.
      </p>
      <LoginForm redirect={redirect} />
    </div>
  );
}
