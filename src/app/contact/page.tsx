import type { Metadata } from "next";

import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";

export const metadata: Metadata = {
  title: "Contact — Rélwè",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
          <h1 className="font-heading text-3xl text-primary mb-2">
            Contact us
          </h1>
          <p className="text-text-secondary mb-10">
            Have a question or need help with a booking?
          </p>

          <div className="border border-border rounded-2xl p-8 bg-surface-raised flex flex-col gap-6">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Email</p>
              <a className="text-primary underline underline-offset-4" href="mailto:hello@relwe.ng">
                hello@relwe.ng
              </a>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Phone</p>
              <a href="tel:+2347074964453" className="text-text">+234 707 496 4453</a>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Hours</p>
              <p className="text-text">Monday — Saturday, 7 AM — 7 PM</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
