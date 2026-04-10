"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  onExpired?: () => void;
  expiresAt: Date;
}

export function Countdown({ expiresAt, onExpired }: CountdownProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)),
  );

  useEffect(() => {
    if (remaining <= 0) {
      onExpired?.();
      return;
    }

    const timer = setInterval(() => {
      const diff = Math.max(
        0,
        Math.floor((expiresAt.getTime() - Date.now()) / 1000),
      );
      setRemaining(diff);
      if (diff <= 0) {
        clearInterval(timer);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired, remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <span
      className={`font-heading text-[18px] tabular-nums ${
        remaining < 120 ? "text-error" : "text-text"
      }`}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}
