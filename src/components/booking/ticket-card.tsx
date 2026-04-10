"use client";

interface TicketCardProps {
  passengerType: string;
  coachNumber: string;
  bookingRef: string;
  seatNumber: number;
  qrDataUrl: string;
  fullName: string;
}

export function TicketCard({
  passengerType,
  coachNumber,
  bookingRef,
  seatNumber,
  qrDataUrl,
  fullName,
}: TicketCardProps) {
  function handleDownload() {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${bookingRef}-${fullName.replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-surface-raised">
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-40 h-40 sm:w-48 sm:h-48 mx-auto sm:mx-0"
          alt={`QR ticket for ${fullName}`}
          src={qrDataUrl}
        />
        <div className="flex flex-col justify-between gap-4">
          <div>
            <p className="font-heading text-lg text-text">{fullName}</p>
            <p className="text-xs text-muted uppercase tracking-wider mt-1">
              {passengerType}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Seat
              </p>
              <p className="text-text font-medium">{seatNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Coach
              </p>
              <p className="text-text font-medium">{coachNumber}</p>
            </div>
          </div>
          <button
            className="h-11 px-5 bg-primary text-text-inverse rounded-xl text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer"
            onClick={handleDownload}
            type="button"
          >
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}
