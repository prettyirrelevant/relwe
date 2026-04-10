"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { CabinClass, SeatStatus } from "~/lib/constants";

import { SeatMap } from "~/components/booking/seat-map";
import { Button } from "~/components/ui/button";

interface SeatSelectorProps {
  maxSelectable: number;
  searchParams: string;
  cabinClass: string;
  coaches: Coach[];
  trainId: string;
}

interface Coach {
  seats: { seatNumber: number; status: string; id: string; }[];
  coachNumber: string;
  id: string;
}

export function SeatSelector({
  coaches: initialCoaches,
  maxSelectable,
  searchParams,
  cabinClass,
  trainId,
}: SeatSelectorProps) {
  const router = useRouter();
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [coaches, setCoaches] = useState(initialCoaches);

  const parsedParams = new URLSearchParams(searchParams);
  const fromStationId = parsedParams.get("from") ?? "";
  const travelDate = parsedParams.get("date") ?? "";

  const sessionId =
    typeof window !== "undefined"
      ? (sessionStorage.getItem("relwe-session") ??
        (() => {
          const id = crypto.randomUUID();
          sessionStorage.setItem("relwe-session", id);
          return id;
        })())
      : "";

  const handleSeatSelect = useCallback(
    async (seatId: string) => {
      // optimistic update
      setSelectedSeatIds((prev) => [...prev, seatId]);

      try {
        const res = await fetch("/api/seats/hold", {
          body: JSON.stringify({
            fromStationId,
            travelDate,
            sessionId,
            trainId,
            seatId,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!res.ok) {
          // revert
          setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
          const data = (await res
            .json()
            .catch(() => ({ error: "" }))) as { error?: string };

          if (res.status === 409) {
            setCoaches((prev) =>
              prev.map((coach) => ({
                ...coach,
                seats: coach.seats.map((s) =>
                  s.id === seatId ? { ...s, status: "held" } : s,
                ),
              })),
            );
            toast.error("That seat was just taken. Pick another.");
          } else {
            toast.error(data.error ?? "Couldn't hold seat. Try again.");
          }
        }
      } catch {
        setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
        toast.error("Couldn't hold seat. Try again.");
      }
    },
    [sessionId, trainId, fromStationId, travelDate],
  );

  const handleSeatDeselect = useCallback(
    async (seatId: string) => {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));

      try {
        await fetch("/api/seats/release", {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, seatId }),
          method: "POST",
        });
      } catch {
        // best effort release
      }
    },
    [sessionId],
  );

  function handleContinue() {
    if (selectedSeatIds.length !== maxSelectable) {
      toast.error(`Please select ${maxSelectable} seat(s).`);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("seats", selectedSeatIds.join(","));
    router.push(`/book/${trainId}/checkout?${params}`);
  }

  // find selected seat labels for the summary
  const selectedSeats = selectedSeatIds
    .map((id) => {
      for (const coach of coaches) {
        const seat = coach.seats.find((s) => s.id === id);
        if (seat) return { ...seat, coachNumber: coach.coachNumber };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* seat map */}
      <div className="lg:col-span-3">
        <SeatMap
          coaches={coaches.map((c) => ({
            ...c,
            seats: c.seats.map((s) => ({
              ...s,
              status: s.status as SeatStatus,
            })),
          }))}
          cabinClass={cabinClass as CabinClass}
          onSeatDeselect={handleSeatDeselect}
          selectedSeatIds={selectedSeatIds}
          onSeatSelect={handleSeatSelect}
          maxSelectable={maxSelectable}
        />
      </div>

      {/* summary sidebar */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-8 bg-white/80 border border-border rounded-lg p-6">
          <h2 className="font-heading text-[18px] text-text mb-6">
            Selected seats
          </h2>

          {selectedSeats.length === 0 ? (
            <p className="text-muted text-[14px]">
              Tap seats to select them. You need {maxSelectable} seat(s).
            </p>
          ) : (
            <ul className="flex flex-col gap-2 mb-6">
              {selectedSeats.map(
                (seat) =>
                  seat && (
                    <li
                      className="flex items-center justify-between text-[14px]"
                      key={seat.id}
                    >
                      <span className="text-text">
                        Seat {seat.seatNumber}, {seat.coachNumber}
                      </span>
                      <button
                        className="text-error cursor-pointer hover:underline"
                        onClick={() => handleSeatDeselect(seat.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </li>
                  ),
              )}
            </ul>
          )}

          <p className="text-muted text-[14px] mb-6">
            {selectedSeatIds.length} of {maxSelectable} selected
          </p>

          <Button
            disabled={selectedSeatIds.length !== maxSelectable}
            onClick={handleContinue}
            className="w-full"
            variant="primary"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
