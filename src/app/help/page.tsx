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
      "Search for your route and date on the home page, pick a train and class, choose your seats, fill in passenger details, then pay with cNGN on Solana. Once the payment lands, your QR ticket is ready to download.",
    question: "How do I book a ticket?",
  },
  {
    answer:
      "We accept cNGN on the Solana network. Each booking gets its own unique wallet address, so you can pay from any Solana wallet (Phantom, Solflare, Backpack, etc.). The payment is detected and confirmed automatically.",
    question: "What payment methods are accepted?",
  },
  {
    answer:
      "After payment is confirmed, you're taken straight to your trip page where you can download a QR ticket for each passenger. You can come back to it anytime under \"My trips\".",
    question: "How do I get my ticket?",
  },
  {
    answer:
      "Yes. When you fill in passenger details, you can enter info for other people travelling with you. Each passenger needs their own name, NIN, and phone number.",
    question: "Can I book for someone else?",
  },
  {
    answer:
      "Up to 6 tickets in a single booking.",
    question: "How many tickets can I book at once?",
  },
  {
    answer:
      "Tickets are valid only for the date and train you selected. If you miss your train, you'll need to book again.",
    question: "What if I miss my train?",
  },
  {
    answer:
      "Heads up: this is a proof of concept. NIN isn't actually validated, any 11 digit number works. In a real deployment it would be checked against the official identity registry.",
    question: "Is my NIN verified?",
  },
  {
    answer:
      "Nine stations along the Lagos to Ibadan corridor: Ebute Metta, Agege, Agbado, Kajola, Papalanto, Abeokuta, Olodo, Omi-Adio, and Moniya.",
    question: "What stations are served?",
  },
  {
    answer:
      "About 2 hours 30 minutes end to end. Express trains skip some intermediate stops and can be a little faster.",
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
