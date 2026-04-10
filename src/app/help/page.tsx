import type { Metadata } from "next";

import { Accordion } from "~/components/ui/accordion";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";

export const metadata: Metadata = {
  description: "Frequently asked questions about booking train tickets with Rélwè.",
  title: "FAQ — Rélwè",
};

const FAQ_ITEMS = [
  {
    answer:
      "Search for your route and date on the home page, select a train and class, pick your seats, fill in passenger details, and pay with USDC on Solana. Your QR ticket is generated instantly.",
    question: "How do I book a ticket?",
  },
  {
    answer:
      "We accept USDC on the Solana blockchain. You can pay from any Solana wallet (Phantom, Solflare, etc.). The payment is verified automatically.",
    question: "What payment methods are accepted?",
  },
  {
    answer:
      "After payment is confirmed, your QR ticket appears on screen and is sent to your email. You can also find it under \"My trips\" anytime.",
    question: "How do I get my ticket?",
  },
  {
    answer:
      "Yes. When selecting passengers, you can enter details for other people. Each passenger needs a name, NIN, and phone number.",
    question: "Can I book for someone else?",
  },
  {
    answer:
      "You can book up to 6 tickets in a single booking.",
    question: "How many tickets can I book at once?",
  },
  {
    answer:
      "Tickets are valid only for the selected date and train. If you miss your train, you will need to book a new ticket.",
    question: "What if I miss my train?",
  },
  {
    answer:
      "NIN is collected for identification purposes at the station. Verification is handled during check-in.",
    question: "Is my NIN verified?",
  },
  {
    answer:
      "The Lagos-Ibadan corridor covers 9 stations: Ebute Metta, Agege, Agbado, Kajola, Papalanto, Abeokuta, Olodo, Omi-Adio, and Moniya.",
    question: "What stations are served?",
  },
  {
    answer:
      "The full Lagos to Ibadan journey takes approximately 2 hours and 30 minutes. Express trains skip some stations and may be slightly faster.",
    question: "How long is the journey?",
  },
];

export default function HelpPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
          <h1 className="font-heading text-3xl text-primary mb-2">
            Frequently asked questions
          </h1>
          <p className="text-text-secondary mb-10">
            Everything you need to know about booking with Rélwè.
          </p>
          <Accordion items={FAQ_ITEMS} />
        </div>
      </main>
      <Footer />
    </>
  );
}
