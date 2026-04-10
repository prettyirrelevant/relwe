import type { Metadata } from "next";

import { eq } from "drizzle-orm";

import { trainStops, stations, trains } from "~/db/schema";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { formatTime } from "~/lib/format";
import { db } from "~/db";

export const metadata: Metadata = {
  description: "Lagos to Ibadan train timetable. View all daily departures and arrivals.",
  title: "Timetable — Rélwè",
};

interface TrainSchedule {
  stops: { stationArea: string; stationName: string; departure: string; arrival: string; }[];
  direction: string;
  code: string;
  name: string;
  type: string;
}

export default async function TimetablePage() {
  let timetable: TrainSchedule[] = [];

  try {
    timetable = await getFullTimetable();
  } catch {
    // DB not connected
  }

  const lagosToIbadan = timetable.filter((t) => t.direction === "lagos-ibadan");
  const ibadanToLagos = timetable.filter((t) => t.direction === "ibadan-lagos");

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
          <h1 className="font-heading text-3xl text-primary mb-2">Timetable</h1>
          <p className="text-text-secondary mb-10">
            Lagos — Ibadan corridor. Daily schedule.
          </p>

          <div className="flex flex-col gap-14">
            <DirectionSection title="Lagos → Ibadan" trains={lagosToIbadan} />
            <DirectionSection title="Ibadan → Lagos" trains={ibadanToLagos} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function DirectionSection({ trains: trainList, title }: { trains: TrainSchedule[]; title: string; }) {
  if (trainList.length === 0) return null;

  return (
    <section>
      <h2 className="font-heading text-xl text-text mb-6">{title}</h2>
      <div className="flex flex-col gap-6">
        {trainList.map((train) => (
          <div className="border border-border rounded-2xl overflow-hidden" key={train.code}>
            <div className="bg-surface-raised px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-heading text-base text-text">{train.name}</span>
                <span className="text-sm text-muted ml-3">{train.code}</span>
              </div>
              <span className="text-xs text-muted uppercase tracking-wider">
                {train.type === "express" ? "Express" : "All stops"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-muted uppercase tracking-wider border-b border-border">
                    <th className="px-6 py-3 font-medium">Station</th>
                    <th className="px-6 py-3 font-medium">Arrives</th>
                    <th className="px-6 py-3 font-medium">Departs</th>
                  </tr>
                </thead>
                <tbody>
                  {train.stops.map((stop, idx) => (
                    <tr className="border-b border-border last:border-0" key={idx}>
                      <td className="px-6 py-3">
                        <span className="text-text">{stop.stationName}</span>
                        <span className="text-muted text-xs ml-2">{stop.stationArea}</span>
                      </td>
                      <td className="px-6 py-3 text-text tabular-nums">{formatTime(stop.arrival)}</td>
                      <td className="px-6 py-3 text-text tabular-nums">{formatTime(stop.departure)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function getFullTimetable(): Promise<TrainSchedule[]> {
  const allTrains = await db.select().from(trains).orderBy(trains.code);

  const schedules = await Promise.all(
    allTrains.map(async (train) => {
      const stops = await db
        .select({
          departure: trainStops.departureTime,
          arrival: trainStops.arrivalTime,
          stationArea: stations.area,
          stationName: stations.name,
        })
        .from(trainStops)
        .innerJoin(stations, eq(stations.id, trainStops.stationId))
        .where(eq(trainStops.trainId, train.id))
        .orderBy(trainStops.sequence);

      return {
        direction: train.direction,
        code: train.code,
        name: train.name,
        type: train.type,
        stops,
      };
    }),
  );

  return schedules;
}
