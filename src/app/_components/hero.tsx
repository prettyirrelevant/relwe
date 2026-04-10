"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { StationSelect } from "~/components/booking/station-select";
import { Stepper } from "~/components/ui/stepper";

interface Station {
  area: string;
  code: string;
  name: string;
  id: string;
}

interface HeroProps {
  stations: Station[];
}

export function Hero({ stations }: HeroProps) {
  const router = useRouter();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to || !date) return;
    const params = new URLSearchParams({
      passengers: String(passengers),
      date,
      from,
      to,
    });
    router.push(`/trains?${params}`);
  }

  function swapStations() {
    setFrom(to);
    setTo(from);
  }

  return (
    <section className="relative bg-surface min-h-[calc(100vh-5rem)] flex items-center">
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 md:px-10 py-20 md:py-28 w-full">
        <h1 className="font-heading text-5xl md:text-7xl text-primary leading-[0.9] tracking-tight text-center">
          Rélwè
        </h1>
        <p className="text-text-secondary text-lg text-center mt-5 mb-14 max-w-md mx-auto leading-relaxed">
          Lagos to Ibadan, from your phone.
        </p>

        <form
          className="bg-surface-raised border border-border rounded-2xl p-7 md:p-9 shadow-sm"
          onSubmit={handleSearch}
        >
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
            <StationSelect
              stations={stations}
              onChange={setFrom}
              id="from-station"
              label="From"
              value={from}
            />
            <StationSelect
              stations={stations}
              onChange={setTo}
              id="to-station"
              label="To"
              value={to}
            />
            <button
              className="absolute left-1/2 top-[calc(50%+14px)] -translate-x-1/2 -translate-y-1/2 hidden md:flex w-10 h-10 items-center justify-center bg-primary text-text-inverse rounded-full cursor-pointer hover:bg-primary-light transition-colors shadow-md z-10"
              onClick={swapStations}
              title="swap stations"
              type="button"
            >
              <svg
                stroke="currentColor"
                strokeLinecap="round"
                viewBox="0 0 16 16"
                strokeWidth="1.5"
                fill="none"
                height="16"
                width="16"
              >
                <path d="M2 6h12M14 6l-3-3M14 6l-3 3" />
                <path d="M14 10H2M2 10l3-3M2 10l3 3" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="min-w-0">
              <label
                className="block text-sm font-medium text-text-secondary mb-2"
                htmlFor="travel-date"
              >
                Date
              </label>
              <input
                className="block w-full min-w-0 h-13 px-4 bg-surface border border-border rounded-xl text-text text-base appearance-none focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors"
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                id="travel-date"
                value={date}
                type="date"
                required
              />
            </div>
            <Stepper
              onChange={setPassengers}
              label="Passengers"
              value={passengers}
              max={6}
              min={1}
            />
          </div>

          <button
            className="w-full h-14 mt-7 bg-accent text-text font-heading text-lg rounded-xl hover:bg-accent-hover transition-colors cursor-pointer shadow-sm"
            type="submit"
          >
            Find trains
          </button>
        </form>
      </div>
    </section>
  );
}
