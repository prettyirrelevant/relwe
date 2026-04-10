"use client";

import { useState } from "react";
import { toast } from "sonner";

import { type CabinClass, type SeatStatus, SEAT_LAYOUTS } from "~/lib/constants";

interface SeatMapProps {
  onSeatDeselect: (seatId: string) => void;
  onSeatSelect: (seatId: string) => void;
  selectedSeatIds: string[];
  cabinClass: CabinClass;
  maxSelectable: number;
  coaches: Coach[];
}

interface Seat {
  seatNumber: number;
  status: SeatStatus;
  id: string;
}

interface Coach {
  coachNumber: string;
  seats: Seat[];
  id: string;
}

const STATUS_STYLES: Record<
  "selected" | SeatStatus,
  { border: string; cursor: string; text: string; bg: string; }
> = {
  held: {
    border: "border border-dashed border-held-border",
    cursor: "cursor-not-allowed",
    text: "text-held-text",
    bg: "bg-held",
  },
  available: {
    border: "border border-primary",
    cursor: "cursor-pointer",
    bg: "bg-transparent",
    text: "text-primary",
  },
  selected: {
    border: "border-2 border-primary",
    cursor: "cursor-pointer",
    text: "text-text",
    bg: "bg-accent",
  },
  reserved: {
    cursor: "cursor-not-allowed",
    text: "text-text-inverse",
    border: "border-none",
    bg: "bg-error",
  },
  booked: {
    cursor: "cursor-not-allowed",
    text: "text-text-inverse",
    border: "border-none",
    bg: "bg-error",
  },
};

export function SeatMap({
  selectedSeatIds,
  onSeatDeselect,
  maxSelectable,
  onSeatSelect,
  cabinClass,
  coaches,
}: SeatMapProps) {
  const [activeCoach, setActiveCoach] = useState(0);
  const layout = SEAT_LAYOUTS[cabinClass];

  const seatColumns = layout.columns.filter((c) => c === "seat").length;

  const gridTemplate = layout.columns
    .map((col) => (col === "aisle" ? "2rem" : "1fr"))
    .join(" ");

  const currentCoach = coaches[activeCoach];
  if (!currentCoach) return null;

  function handleSeatClick(seat: Seat) {
    if (seat.status !== "available" && !selectedSeatIds.includes(seat.id)) {
      return;
    }

    if (selectedSeatIds.includes(seat.id)) {
      onSeatDeselect(seat.id);
      return;
    }

    if (selectedSeatIds.length >= maxSelectable) {
      toast.error(`you can only select ${maxSelectable} seat(s)`);
      return;
    }

    onSeatSelect(seat.id);
  }

  // arrange seats into grid rows
  const rows: ("aisle" | Seat)[][] = [];
  let seatIndex = 0;
  const totalRows = Math.ceil(currentCoach.seats.length / seatColumns);

  for (let r = 0; r < totalRows; r++) {
    const row: ("aisle" | Seat)[] = [];
    for (const col of layout.columns) {
      if (col === "aisle") {
        row.push("aisle");
      } else {
        row.push(currentCoach.seats[seatIndex] ?? { status: "available" as SeatStatus, seatNumber: 0, id: "" });
        seatIndex++;
      }
    }
    rows.push(row);
  }

  return (
    <div>
      {/* legend */}
      <div className="flex flex-wrap gap-6 mb-6">
        <LegendItem border="border border-primary" bg="bg-transparent" label="available" />
        <LegendItem border="border-2 border-primary" label="selected" bg="bg-accent" />
        <LegendItem border="border border-dashed border-held-border" bg="bg-held" label="held" />
        <LegendItem border="border-none" bg="bg-error" label="taken" />
      </div>

      {/* coach tabs */}
      {coaches.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {coaches.map((coach, idx) => {
            const available = coach.seats.filter(
              (s) => s.status === "available" || selectedSeatIds.includes(s.id),
            ).length;
            return (
              <button
                className={`px-4 h-10 rounded-lg text-[14px] whitespace-nowrap cursor-pointer ${
                  idx === activeCoach
                    ? "bg-primary text-text-inverse"
                    : "border border-primary text-primary"
                }`}
                onClick={() => setActiveCoach(idx)}
                key={coach.id}
                type="button"
              >
                {coach.coachNumber} ({available} left)
              </button>
            );
          })}
        </div>
      )}

      {/* seat grid */}
      <div
        style={{
          gridTemplateColumns: gridTemplate,
          display: "grid",
        }}
        className="gap-2"
      >
        {rows.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => {
            if (cell === "aisle") {
              return <div key={`aisle-${rowIdx}-${colIdx}`} />;
            }

            const seat = cell;
            if (!seat.id) return <div key={`empty-${rowIdx}-${colIdx}`} />;

            const isSelected = selectedSeatIds.includes(seat.id);
            const style = isSelected
              ? STATUS_STYLES.selected
              : STATUS_STYLES[seat.status];
            const isClickable =
              seat.status === "available" || isSelected;

            return (
              <button
                title={
                  isSelected
                    ? `seat ${seat.seatNumber} (selected)`
                    : seat.status === "available"
                      ? `seat ${seat.seatNumber}`
                      : `seat ${seat.seatNumber} (${seat.status})`
                }
                className={`w-full aspect-square max-w-12 rounded-lg flex items-center justify-center text-[14px] ${style.bg} ${style.border} ${style.text} ${style.cursor}`}
                onClick={() => handleSeatClick(seat)}
                disabled={!isClickable}
                key={seat.id}
                type="button"
              >
                {seat.seatNumber}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}

function LegendItem({
  border,
  label,
  bg,
}: {
  border: string;
  label: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${bg} ${border}`} />
      <span className="text-[14px] text-muted">{label}</span>
    </div>
  );
}
