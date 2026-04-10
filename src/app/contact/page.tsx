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
            Contact
          </h1>
          <p className="text-text-secondary mb-2">
            Rélwè is a proof of concept, not a real booking service.
          </p>
          <p className="text-muted text-sm mb-10">
            If you found a bug, want to chat about the project, or are curious
            how it was built, the best place to reach me is on GitHub.
          </p>

          <div className="border border-border rounded-2xl p-8 bg-surface-raised flex flex-col gap-6">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Code
              </p>
              <a
                className="text-primary underline underline-offset-4"
                href="https://github.com/prettyirrelevant/relwe"
                rel="noopener noreferrer"
                target="_blank"
              >
                github.com/prettyirrelevant/relwe
              </a>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Issues and feedback
              </p>
              <a
                href="https://github.com/prettyirrelevant/relwe/issues"
                className="text-primary underline underline-offset-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                Open an issue
              </a>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Author
              </p>
              <a
                className="text-primary underline underline-offset-4"
                href="https://github.com/prettyirrelevant"
                rel="noopener noreferrer"
                target="_blank"
              >
                @prettyirrelevant
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
