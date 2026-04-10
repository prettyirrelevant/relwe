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
          <p className="text-text-secondary mb-10">
            Last updated: April 2026
          </p>

          <div className="flex flex-col gap-10 text-text-secondary leading-relaxed">
            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Information we collect
              </h2>
              <p>
                When you create an account, we collect your name, email address,
                phone number, and National Identification Number (NIN). When you
                book a ticket, we collect travel details including route, date,
                seat selection, and passenger information.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                How we use your information
              </h2>
              <p>
                Your information is used to process bookings, generate tickets,
                send booking confirmations, and verify your identity at the
                station. We do not sell or share your personal data with third
                parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Payment data
              </h2>
              <p>
                Payments are processed on the Solana blockchain using cNGN. We
                generate a unique wallet address for each booking. We do not
                store your wallet private keys or have access to your personal
                wallet.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Data retention
              </h2>
              <p>
                Booking records are retained for the duration required by
                Nigerian railway regulations. You may request deletion of your
                account and associated data by contacting us.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Security
              </h2>
              <p>
                We use industry-standard security measures to protect your
                data, including encrypted connections, secure session management,
                and HMAC-signed tickets to prevent tampering.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-text mb-3">
                Contact
              </h2>
              <p>
                For privacy-related inquiries, contact us at{" "}
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
