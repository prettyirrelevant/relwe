import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";

import { bookings, stations, trains } from "~/db/schema";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { Badge } from "~/components/ui/badge";
import { auth } from "~/lib/auth";
import { db } from "~/db";

export default async function TripsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/trips");

  const userBookings = await db
    .select({
      totalAmountKobo: bookings.totalAmountKobo,
      paymentStatus: bookings.paymentStatus,
      travelDate: bookings.travelDate,
      reference: bookings.reference,
      originName: stations.name,
      trainCode: trains.code,
      trainName: trains.name,
      class: bookings.class,
      id: bookings.id,
    })
    .from(bookings)
    .innerJoin(trains, eq(trains.id, bookings.trainId))
    .innerJoin(stations, eq(stations.id, bookings.originStationId))
    .where(eq(bookings.userId, session.user.id))
    .orderBy(desc(bookings.createdAt));

  const statusVariant = (status: string) => {
    switch (status) {
      case "confirmed": return "success" as const;
      case "expired": return "error" as const;
      case "pending": return "warning" as const;
      default: return "neutral" as const;
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
          <h1 className="font-heading text-3xl text-primary mb-8">My trips</h1>

          {userBookings.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-heading text-xl text-text mb-2">No trips yet</h2>
              <p className="text-muted mb-6">Book your first train ride.</p>
              <Link
                className="h-12 px-8 inline-flex items-center bg-accent text-text font-heading rounded-xl hover:bg-accent-hover transition-colors"
                href="/"
              >
                Find a train
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {userBookings.map((booking) => (
                <Link
                  className="border border-border rounded-2xl p-6 hover:border-accent hover:bg-surface-raised transition-colors"
                  href={`/trips/${booking.id}`}
                  key={booking.id}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-lg text-text">{booking.trainName}</p>
                      <p className="text-sm text-muted mt-1">
                        {booking.reference} · {booking.travelDate} · {booking.class}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-lg text-primary">
                        ₦{(booking.totalAmountKobo / 100).toLocaleString("en-NG")}
                      </span>
                      <Badge variant={statusVariant(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
