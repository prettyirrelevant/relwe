"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CABIN_CLASS_DISPLAY, type CabinClass } from "~/lib/constants";
import { PassengerCard } from "~/components/booking/passenger-card";
import { PaymentStatus } from "~/components/booking/payment-status";
import { Button } from "~/components/ui/button";

interface CheckoutViewProps {
  user: { phone: string; name: string; nin: string; };
  destinationStationId: string;
  pricePerAdultKobo: number;
  pricePerMinorKobo: number;
  originStationId: string;
  cabinClass: string;
  travelDate: string;
  seats: SeatInfo[];
  trainId: string;
}

interface BookingResponse {
  walletAddress: string;
  cngnAmount: number;
  bookingId: string;
  expiresAt: string;
  reference: string;
}

interface PassengerData {
  passengerType: "adult" | "minor";
  fullName: string;
  isSelf: boolean;
  phone: string;
  nin: string;
}

interface SeatInfo {
  coachNumber: string;
  seatNumber: number;
  seatId: string;
}

type Phase = "passengers" | "confirmed" | "payment";

export function CheckoutView({
  destinationStationId,
  pricePerAdultKobo,
  pricePerMinorKobo,
  originStationId,
  cabinClass,
  travelDate,
  trainId,
  seats,
  user,
}: CheckoutViewProps) {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("passengers");
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [passengers, setPassengers] = useState<PassengerData[]>(
    seats.map((_, idx) => ({
      fullName: idx === 0 ? user.name : "",
      phone: idx === 0 ? user.phone : "",
      passengerType: "adult" as const,
      nin: idx === 0 ? user.nin : "",
      isSelf: idx === 0,
    })),
  );

  function updatePassenger(index: number, data: PassengerData) {
    setPassengers((prev) => prev.map((p, i) => (i === index ? data : p)));
  }

  function calculateTotal(): number {
    return passengers.reduce(
      (sum, p) =>
        sum + (p.passengerType === "adult" ? pricePerAdultKobo : pricePerMinorKobo),
      0,
    );
  }

  function validatePassengers(): boolean {
    for (const p of passengers) {
      if (!p.fullName.trim()) {
        toast.error("Please fill in all passenger names.");
        return false;
      }
      if (!p.nin || p.nin.length !== 11 || !/^\d+$/.test(p.nin)) {
        toast.error("NIN must be exactly 11 digits for all passengers.");
        return false;
      }
      if (!p.phone.trim()) {
        toast.error("Please fill in phone numbers for all passengers.");
        return false;
      }
    }
    return true;
  }

  async function handleSubmit() {
    if (!validatePassengers()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        body: JSON.stringify({
          passengers: passengers.map((p, idx) => ({
            passengerType: p.passengerType,
            seatId: seats[idx].seatId,
            fullName: p.fullName,
            isSelf: p.isSelf,
            nin: p.nin,
          })),
          totalAmountKobo: calculateTotal(),
          destinationStationId,
          class: cabinClass,
          originStationId,
          travelDate,
          trainId,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "Failed to create booking.");
        setSubmitting(false);
        return;
      }

      const data = (await res.json()) as BookingResponse;
      setBooking(data);
      setPhase("payment");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const handlePaymentConfirmed = useCallback(() => {
    setPhase("confirmed");
  }, []);

  const handlePaymentExpired = useCallback(() => {
    toast.error("Payment expired. Your seats have been released.");
    router.push("/");
  }, [router]);

  const totalKobo = calculateTotal();
  const totalNgn = (totalKobo / 100).toLocaleString("en-NG");

  // confirmed state
  if (phase === "confirmed" && booking) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-success rounded-full flex items-center justify-center">
          <span className="text-text-inverse text-2xl">✓</span>
        </div>
        <h2 className="font-heading text-3xl text-text mb-2">Booking confirmed</h2>
        <p className="text-text-secondary text-lg mb-1">
          Reference: <span className="font-heading text-primary">{booking.reference}</span>
        </p>
        <p className="text-muted text-sm mb-8">
          Your QR ticket has been sent to your email.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push(`/trips/${booking.bookingId}`)} variant="primary">
            View ticket
          </Button>
          <Button onClick={() => router.push("/")} variant="secondary">
            Book another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* main content */}
      <div className="lg:col-span-7">
        {phase === "passengers" && (
          <div className="flex flex-col gap-6">
            {seats.map((seat, idx) => (
              <PassengerCard
                onChange={(data) => updatePassenger(idx, data)}
                userProfile={idx === 0 ? user : undefined}
                seatLabel={String(seat.seatNumber)}
                coachLabel={seat.coachNumber}
                defaultExpanded={idx === 0}
                data={passengers[idx]}
                key={seat.seatId}
                index={idx}
              />
            ))}
          </div>
        )}

        {phase === "payment" && booking && (
          <PaymentStatus
            amount={`₦${booking.cngnAmount.toLocaleString("en-NG")} cNGN`}
            expiresAt={new Date(booking.expiresAt)}
            walletAddress={booking.walletAddress}
            onConfirmed={handlePaymentConfirmed}
            onExpired={handlePaymentExpired}
            bookingId={booking.bookingId}
          />
        )}
      </div>

      {/* sidebar summary */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-8 border border-border rounded-2xl p-6 bg-surface-raised">
          <h3 className="font-heading text-lg text-text mb-4">Summary</h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Class</span>
              <span className="text-text">{CABIN_CLASS_DISPLAY[cabinClass as CabinClass]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Passengers</span>
              <span className="text-text">{seats.length}</span>
            </div>
            {seats.map((seat, idx) => (
              <div className="flex justify-between text-xs" key={seat.seatId}>
                <span className="text-muted">
                  {passengers[idx]?.fullName || `Passenger ${idx + 1}`}
                </span>
                <span className="text-muted">
                  Seat {seat.seatNumber}, {seat.coachNumber}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-2 flex justify-between">
              <span className="font-medium text-text">Total</span>
              <span className="font-heading text-lg text-primary">₦{totalNgn}</span>
            </div>
          </div>

          {phase === "passengers" && (
            <button
              className="w-full h-13 mt-6 bg-accent text-text font-heading text-base rounded-xl hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              onClick={handleSubmit}
              disabled={submitting}
              type="button"
            >
              {submitting ? "Processing..." : "Proceed to payment"}
            </button>
          )}

          {booking && (
            <p className="text-xs text-muted mt-4 text-center">
              Ref: {booking.reference}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
