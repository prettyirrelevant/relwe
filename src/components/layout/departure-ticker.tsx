interface DepartureTickerProps {
  departures: {
    departureTime: string;
    destination: string;
    trainCode: string;
    origin: string;
  }[];
}

export function DepartureTicker({ departures }: DepartureTickerProps) {
  if (departures.length === 0) return null;

  const tickerText = departures
    .map(
      (d) =>
        `${d.trainCode}  ${d.origin} → ${d.destination}  ${d.departureTime}`,
    )
    .join("          ·          ");

  return (
    <div className="bg-primary/95 border-t border-text-inverse/5 overflow-hidden">
      <div className="py-3">
        <div className="overflow-hidden whitespace-nowrap">
          <p className="text-text-inverse/70 text-sm tracking-wide animate-marquee inline-block">
            {tickerText}
            {"          ·          "}
            {tickerText}
          </p>
        </div>
      </div>
    </div>
  );
}
