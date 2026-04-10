"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CABIN_CLASS_DISPLAY, type CabinClass } from "~/lib/constants";
import { Badge } from "~/components/ui/badge";

interface TrainCardProps {
  destination: { arrivalTime: string; area: string; name: string; };
  origin: { departureTime: string; area: string; name: string; };
  classes: ClassAvailability[];
  searchParams: string;
  code: string;
  name: string;
  type: string;
  id: string;
}

interface ClassAvailability {
  availableSeats: number;
  totalSeats: number;
  class: string;
}

import { formatTime } from "~/lib/format";

export function TrainCard({
  searchParams,
  destination,
  classes,
  origin,
  code,
  name,
  type,
  id,
}: TrainCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  function handleClassSelect(cls: string) {
    const params = new URLSearchParams(searchParams);
    params.set("class", cls);
    router.push(`/book/${id}/seats?${params}`);
  }

  // calculate duration
  const [depH, depM] = origin.departureTime.split(":").map(Number);
  const [arrH, arrM] = destination.arrivalTime.split(":").map(Number);
  const durationMins = (arrH * 60 + arrM) - (depH * 60 + depM);
  const hours = Math.floor(durationMins / 60);
  const mins = durationMins % 60;

  return (
    <div className="bg-white/80 border border-border rounded-lg overflow-hidden">
      <button
        className="w-full p-6 text-left cursor-pointer hover:bg-primary/[0.02]"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-[18px] text-text">{name}</h3>
            <p className="text-muted text-[14px]">
              {code} · {type === "express" ? "Express" : "All stops"}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="font-heading text-[18px] text-text">
                {formatTime(origin.departureTime)}
              </span>
              <p className="text-muted text-[14px]">{origin.area}</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-muted text-[14px]">
                {hours}h {mins}m
              </span>
              <div className="w-16 h-px bg-border" />
            </div>

            <div>
              <span className="font-heading text-[18px] text-text">
                {formatTime(destination.arrivalTime)}
              </span>
              <p className="text-muted text-[14px]">{destination.area}</p>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-6">
          <div className="flex flex-wrap gap-4">
            {classes.map((cls) => {
              const isSoldOut = cls.availableSeats === 0;
              const variant: "success" | "warning" | "error" =
                cls.availableSeats > 10
                  ? "success"
                  : cls.availableSeats > 0
                    ? "warning"
                    : "error";

              return (
                <button
                  className={`flex-1 min-w-[150px] p-4 rounded-lg border text-left cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSoldOut
                      ? "border-muted/30 bg-muted/5"
                      : "border-primary/20 hover:border-primary hover:bg-primary/[0.02]"
                  }`}
                  onClick={() => handleClassSelect(cls.class)}
                  disabled={isSoldOut}
                  key={cls.class}
                  type="button"
                >
                  <span className="font-heading text-[14px] text-text block">
                    {CABIN_CLASS_DISPLAY[cls.class as CabinClass] ?? cls.class}
                  </span>
                  <Badge variant={variant}>
                    {isSoldOut
                      ? "sold out"
                      : `${cls.availableSeats} seats left`}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
