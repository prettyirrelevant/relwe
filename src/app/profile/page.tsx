import type { Metadata } from "next";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { Badge } from "~/components/ui/badge";
import { auth } from "~/lib/auth";

export const metadata: Metadata = {
  title: "Profile — Rélwè",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/profile");

  const user = session.user as Record<string, unknown>;

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
          <h1 className="font-heading text-3xl text-primary mb-8">Profile</h1>

          <div className="border border-border rounded-2xl p-8 bg-surface-raised">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Name</p>
                <p className="text-text text-lg">{session.user.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Email</p>
                <p className="text-text text-lg">{session.user.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Phone</p>
                <p className="text-text text-lg">{(user.phone as string) || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">NIN</p>
                <div className="flex items-center gap-3">
                  <p className="text-text text-lg">
                    {(user.nin as string) ? "••••••" + (user.nin as string).slice(-4) : "Not set"}
                  </p>
                  {(user.ninVerified as boolean) && (
                    <Badge variant="success">Verified</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
