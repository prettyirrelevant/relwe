"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CABIN_CLASS_DISPLAY, type CabinClass } from "~/lib/constants";
import { Badge } from "~/components/ui/badge";
import { formatTime } from "~/lib/format";

interface TrainCardProps {
  destination: { arrivalTime: string; area: string; name: string; };
  origin: { departureTime: string; area: string; name: string; };
  classes: ClassAvailability[];
  searchParams: string;
  travelDate: string;
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

export function TrainCard({
  searchParams,
  destination,
  travelDate,
  classes,
  origin,
  code,
  name,
  type,
  id,
}: TrainCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const departed = isDeparted(travelDate, origin.departureTime);

  function handleClassSelect(cls: string) {
    if (departed) return;
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
    <div
      className={`bg-white/80 border border-border rounded-lg overflow-hidden ${
        departed ? "opacity-50" : ""
      }`}
    >
      <button
        className="w-full p-6 text-left cursor-pointer hover:bg-primary/[0.02]"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-[18px] text-text">{name}</h3>
              {departed && <Badge variant="neutral">Departed</Badge>}
            </div>
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
              const disabled = isSoldOut || departed;
              const variant: "success" | "warning" | "error" =
                cls.availableSeats > 10
                  ? "success"
                  : cls.availableSeats > 0
                    ? "warning"
                    : "error";

              return (
                <button
                  className={`flex-1 min-w-[150px] p-4 rounded-lg border text-left cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    disabled
                      ? "border-muted/30 bg-muted/5"
                      : "border-primary/20 hover:border-primary hover:bg-primary/[0.02]"
                  }`}
                  onClick={() => handleClassSelect(cls.class)}
                  disabled={disabled}
                  key={cls.class}
                  type="button"
                >
                  <span className="font-heading text-[14px] text-text block">
                    {CABIN_CLASS_DISPLAY[cls.class as CabinClass] ?? cls.class}
                  </span>
                  <Badge variant={variant}>
                    {departed
                      ? "Departed"
                      : isSoldOut
                        ? "Sold out"
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

function isDeparted(travelDate: string, departureTime: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  if (travelDate !== today) return false;
  const nowHHMM = new Date().toTimeString().slice(0, 5);
  return departureTime.slice(0, 5) <= nowHHMM;
}
