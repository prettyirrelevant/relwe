import type { Metadata } from "next";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up — Rélwè",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect = "/" } = await searchParams;

  return (
    <div>
      <h1 className="font-heading text-[32px] text-primary mb-2">
        Create your account
      </h1>
      <p className="text-muted mb-8">
        Sign up to start booking train tickets.
      </p>
      <SignupForm redirect={redirect} />
    </div>
  );
}
