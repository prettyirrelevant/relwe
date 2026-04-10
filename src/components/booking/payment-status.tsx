"use client";

import { useCallback, useEffect, useState } from "react";

import { PAYMENT_POLL_INTERVAL_MS } from "~/lib/constants";
import { Countdown } from "~/components/ui/countdown";

interface PaymentStatusProps {
  onConfirmed: () => void;
  onExpired: () => void;
  walletAddress: string;
  bookingId: string;
  expiresAt: Date;
  amount: string;
}

type PaymentState = "confirmed" | "expired" | "waiting";

export function PaymentStatus({
  walletAddress,
  onConfirmed,
  bookingId,
  expiresAt,
  onExpired,
  amount,
}: PaymentStatusProps) {
  const [status, setStatus] = useState<PaymentState>("waiting");
  const [copied, setCopied] = useState(false);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/payment-status`);
      const data = (await res.json()) as { status: string };
      if (data.status === "confirmed") {
        setStatus("confirmed");
        onConfirmed();
      }
    } catch {
      // silently retry on next interval
    }
  }, [bookingId, onConfirmed]);

  useEffect(() => {
    if (status !== "waiting") return;

    const interval = setInterval(poll, PAYMENT_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [status, poll]);

  function handleCopy() {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "confirmed") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 bg-success rounded-full flex items-center justify-center">
          <span className="text-text-inverse text-2xl">✓</span>
        </div>
        <h3 className="font-heading text-2xl text-text">
          Payment confirmed
        </h3>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="text-center py-12">
        <h3 className="font-heading text-2xl text-error">
          Payment expired
        </h3>
        <p className="text-muted mt-2">
          Your seats have been released. Please book again.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      {/* status header */}
      <div className="bg-surface-raised px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-text">Waiting for payment</span>
        </div>
        <Countdown
          onExpired={() => {
            setStatus("expired");
            onExpired();
          }}
          expiresAt={expiresAt}
        />
      </div>

      {/* amount */}
      <div className="px-6 py-8 text-center border-b border-border">
        <p className="text-xs text-muted uppercase tracking-wider mb-2">
          Amount due
        </p>
        <p className="font-heading text-4xl text-primary">
          {amount}
        </p>
        <p className="text-xs text-muted mt-2">Solana (Devnet)</p>
      </div>

      {/* wallet address */}
      <div className="px-6 py-5">
        <p className="text-xs text-muted uppercase tracking-wider mb-3">
          Send to this wallet address
        </p>
        <div className="flex">
          <input
            className="flex-1 h-12 px-4 bg-surface border border-border rounded-l-xl text-text text-sm font-mono truncate"
            value={walletAddress}
            type="text"
            readOnly
          />
          <button
            className="h-12 px-5 bg-primary text-text-inverse rounded-r-xl text-sm cursor-pointer hover:bg-primary-light transition-colors"
            onClick={handleCopy}
            type="button"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-muted mt-4 leading-relaxed">
          Send exactly <span className="font-medium text-text">{amount}</span> to
          the address above from any Solana wallet (Phantom, Solflare, etc.).
          Your booking will be confirmed automatically once the transaction is
          detected.
        </p>

        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-xs text-muted uppercase tracking-wider mb-3">
            Need devnet tokens?
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <a
              className="text-primary underline underline-offset-4 hover:text-primary-light transition-colors"
              href="https://faucet.solana.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              SOL faucet ↗
            </a>
            <span className="text-muted/40">·</span>
            <a
              className="text-primary underline underline-offset-4 hover:text-primary-light transition-colors"
              href="https://app.cngn.co/faucet"
              rel="noopener noreferrer"
              target="_blank"
            >
              cNGN faucet ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
