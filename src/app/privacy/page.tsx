import type { Metadata } from "next";

import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";

export const metadata: Metadata = {
  title: "Privacy Policy — Rélwè",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
          <h1 className="font-heading text-3xl text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-text-secondary mb-2">
            Last updated: April 2026
          </p>
          <p className="text-muted text-sm mb-10">
            Heads up: Rélwè is a proof of concept, not a real booking service.
            Treat this page as a placeholder.
          </p>

          <div className="flex flex-col gap-10 text-text-secondary leading-relaxed">
            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                What we collect
              </h2>
              <p>
                When you sign up, we ask for your name, email, phone, and an
                11 digit NIN. When you book a ticket, we save your trip details
                (route, date, seats) along with the names and contact info of
                everyone travelling.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                How we use it
              </h2>
              <p>
                Your information is only used to process bookings, generate QR
                tickets, and confirm your trip. We never sell it, and we never
                share it with third parties for marketing.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Payments
              </h2>
              <p>
                Payments happen on Solana with cNGN. Each booking gets its own
                unique wallet address generated on our servers. We only see
                what arrives at that address. We never see, touch, or store
                your personal wallet&apos;s private keys.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                NIN handling
              </h2>
              <p>
                In this PoC, the NIN field is not actually verified. Anything
                with 11 digits is accepted. In a real deployment it would be
                validated against the official identity registry.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Keeping things safe
              </h2>
              <p>
                We use HTTPS for everything, sessions are managed with signed
                cookies, and every QR ticket is HMAC signed so it cannot be
                forged or tampered with at the station.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Deleting your data
              </h2>
              <p>
                You can request a copy or deletion of your account anytime by
                emailing the address below. There&apos;s no automated tooling
                yet, but we&apos;ll handle requests manually.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Contact
              </h2>
              <p>
                Questions about privacy? Reach out at{" "}
                <a
                  className="text-primary underline underline-offset-4"
                  href="mailto:privacy@relwe.ng"
                >
                  privacy@relwe.ng
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
