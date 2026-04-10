import type { Metadata } from "next";

import { Atkinson_Hyperlegible_Next, Fraunces } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  description:
    "Book train tickets across Nigeria. Lagos to Ibadan, from your phone.",
  icons: {
    icon: [
      { type: "image/svg+xml", url: "/favicon.svg" },
    ],
  },
  title: "Rélwè — Book your seat, ride the rails",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${fraunces.variable} ${atkinson.variable} h-full antialiased`}
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" theme="light" />
      </body>
    </html>
  );
}
