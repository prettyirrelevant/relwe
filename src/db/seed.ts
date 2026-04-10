import { drizzle } from "drizzle-orm/tidb-serverless";
import { connect } from "@tidbcloud/serverless";

import {
  type CabinClass,
  RUNS_WEEKDAYS,
  RUNS_WEEKENDS,
  SEAT_LAYOUTS,
  RUNS_DAILY,
} from "~/lib/constants";
import { ID_PREFIXES, prefixedId } from "~/lib/id";

import {
  trainStops,
  stations,
  coaches,
  pricing,
  trains,
  seats,
} from "./schema";

const client = connect({ url: process.env.DATABASE_URL! });
const db = drizzle(client);

const STATIONS_DATA = [
  { name: "Mobolaji Johnson Station", area: "Ebute Metta", code: "MJS", position: 1 },
  { name: "Babatunde Raji Fashola Station", area: "Agege", code: "BRF", position: 2 },
  { name: "Lateef Kayode Jakande Station", area: "Agbado", code: "LKJ", position: 3 },
  { name: "Professor Yemi Oshinbajo Station", area: "Kajola", code: "PYO", position: 4 },
  { name: "Olu Funmilayo Ransome Kuti Station", area: "Papalanto", code: "ORK", position: 5 },
  { name: "Professor Wole Soyinka Station", area: "Abeokuta", code: "PWS", position: 6 },
  { name: "Aremo Olusegun Osoba Station", area: "Olodo", code: "AOO", position: 7 },
  { name: "Ladoke Akintola Station", area: "Omi-Adio", position: 8, code: "LA" },
  { name: "Obafemi Awolowo Station", area: "Moniya", position: 9, code: "OA" },
] as const;

const TRAINS_DATA = [
  {
    stops: [
      { departure: "07:45", arrival: "07:42", station: "MJS", distance: 0 },
      { departure: "08:09", arrival: "08:06", station: "BRF", distance: 20 },
      { departure: "08:24", arrival: "08:21", station: "LKJ", distance: 40 },
      { departure: "08:45", arrival: "08:42", station: "PYO", distance: 60 },
      { departure: "08:55", arrival: "08:52", station: "ORK", distance: 80 },
      { departure: "09:21", arrival: "09:16", station: "PWS", distance: 100 },
      { departure: "09:43", arrival: "09:40", station: "AOO", distance: 120 },
      { departure: "10:00", arrival: "09:57", distance: 140, station: "LA" },
      { departure: "10:21", arrival: "10:18", distance: 160, station: "OA" },
    ],
    direction: "lagos-ibadan",
    runsOnDays: RUNS_WEEKDAYS,
    name: "Lagos — Ibadan",
    type: "all-stops",
    code: "LI1",
  },
  {
    stops: [
      { departure: "08:00", arrival: "07:57", station: "OA", distance: 0 },
      { departure: "08:20", arrival: "08:17", station: "LA", distance: 20 },
      { departure: "08:38", arrival: "08:35", station: "AOO", distance: 40 },
      { departure: "09:02", arrival: "08:57", station: "PWS", distance: 60 },
      { departure: "09:25", arrival: "09:22", station: "ORK", distance: 80 },
      { departure: "09:36", arrival: "09:33", station: "PYO", distance: 100 },
      { departure: "09:57", arrival: "09:54", station: "LKJ", distance: 120 },
      { departure: "10:12", arrival: "10:09", station: "BRF", distance: 140 },
      { departure: "10:36", arrival: "10:33", station: "MJS", distance: 160 },
    ],
    direction: "ibadan-lagos",
    name: "Ibadan — Lagos",
    runsOnDays: RUNS_DAILY,
    type: "all-stops",
    code: "IL2",
  },
  {
    stops: [
      { departure: "08:00", arrival: "07:57", station: "MJS", distance: 0 },
      { departure: "08:24", arrival: "08:21", station: "BRF", distance: 20 },
      { departure: "08:39", arrival: "08:36", station: "LKJ", distance: 40 },
      { departure: "09:00", arrival: "08:57", station: "PYO", distance: 60 },
      { departure: "09:10", arrival: "09:07", station: "ORK", distance: 80 },
      { departure: "09:36", arrival: "09:31", station: "PWS", distance: 100 },
      { departure: "09:58", arrival: "09:55", station: "AOO", distance: 120 },
      { departure: "10:15", arrival: "10:12", distance: 140, station: "LA" },
      { departure: "10:36", arrival: "10:33", distance: 160, station: "OA" },
    ],
    direction: "lagos-ibadan",
    runsOnDays: RUNS_WEEKENDS,
    name: "Lagos — Ibadan",
    type: "all-stops",
    code: "LI3",
  },
  {
    stops: [
      { departure: "10:50", arrival: "10:47", station: "OA", distance: 0 },
      { departure: "11:10", arrival: "11:07", station: "LA", distance: 20 },
      { departure: "11:49", arrival: "11:44", station: "PWS", distance: 60 },
      { departure: "12:50", arrival: "12:47", station: "BRF", distance: 140 },
      { departure: "13:14", arrival: "13:11", station: "MJS", distance: 160 },
    ],
    name: "Ibadan — Lagos Express",
    direction: "ibadan-lagos",
    runsOnDays: RUNS_WEEKENDS,
    type: "express",
    code: "IL4",
  },
  {
    stops: [
      { departure: "13:40", arrival: "13:37", station: "MJS", distance: 0 },
      { departure: "14:04", arrival: "14:01", station: "BRF", distance: 20 },
      { departure: "15:07", arrival: "15:02", station: "PWS", distance: 100 },
      { departure: "15:43", arrival: "15:40", distance: 140, station: "LA" },
      { departure: "16:04", arrival: "16:01", distance: 160, station: "OA" },
    ],
    name: "Lagos — Ibadan Express",
    direction: "lagos-ibadan",
    runsOnDays: RUNS_WEEKENDS,
    type: "express",
    code: "LI5",
  },
  {
    stops: [
      { departure: "16:00", arrival: "15:57", station: "MJS", distance: 0 },
      { departure: "16:24", arrival: "16:21", station: "BRF", distance: 20 },
      { departure: "16:39", arrival: "16:36", station: "LKJ", distance: 40 },
      { departure: "17:00", arrival: "16:57", station: "PYO", distance: 60 },
      { departure: "17:10", arrival: "17:07", station: "ORK", distance: 80 },
      { departure: "17:36", arrival: "17:31", station: "PWS", distance: 100 },
      { departure: "17:58", arrival: "17:55", station: "AOO", distance: 120 },
      { departure: "18:15", arrival: "18:12", distance: 140, station: "LA" },
      { departure: "18:36", arrival: "18:33", distance: 160, station: "OA" },
    ],
    direction: "lagos-ibadan",
    name: "Lagos — Ibadan",
    runsOnDays: RUNS_DAILY,
    type: "all-stops",
    code: "LI7",
  },
  {
    stops: [
      { departure: "16:00", arrival: "15:57", station: "OA", distance: 0 },
      { departure: "16:20", arrival: "16:17", station: "LA", distance: 20 },
      { departure: "16:38", arrival: "16:35", station: "AOO", distance: 40 },
      { departure: "17:02", arrival: "16:57", station: "PWS", distance: 60 },
      { departure: "17:25", arrival: "17:22", station: "ORK", distance: 80 },
      { departure: "17:36", arrival: "17:33", station: "PYO", distance: 100 },
      { departure: "17:57", arrival: "17:54", station: "LKJ", distance: 120 },
      { departure: "18:12", arrival: "18:09", station: "BRF", distance: 140 },
      { departure: "18:36", arrival: "18:33", station: "MJS", distance: 160 },
    ],
    direction: "ibadan-lagos",
    runsOnDays: RUNS_WEEKDAYS,
    name: "Ibadan — Lagos",
    type: "all-stops",
    code: "IL6",
  },
  {
    stops: [
      { departure: "16:30", arrival: "16:27", station: "OA", distance: 0 },
      { departure: "16:50", arrival: "16:47", station: "LA", distance: 20 },
      { departure: "17:08", arrival: "17:05", station: "AOO", distance: 40 },
      { departure: "17:32", arrival: "17:27", station: "PWS", distance: 60 },
      { departure: "17:55", arrival: "17:52", station: "ORK", distance: 80 },
      { departure: "18:06", arrival: "18:03", station: "PYO", distance: 100 },
      { departure: "18:27", arrival: "18:24", station: "LKJ", distance: 120 },
      { departure: "18:42", arrival: "18:39", station: "BRF", distance: 140 },
      { departure: "19:06", arrival: "19:03", station: "MJS", distance: 160 },
    ],
    direction: "ibadan-lagos",
    runsOnDays: RUNS_WEEKENDS,
    name: "Ibadan — Lagos",
    type: "all-stops",
    code: "IL8",
  },
];

// Prices in kobo (NGN * 100)
// Per-km rates in kobo (NGN * 100).
// Devnet faucet caps at 1,000 cNGN, so prices are scaled down ~10x
// from real NRC fares to keep full-route tickets affordable for testing.
// Full route (160 km): first ₦800, business ₦560, standard ₦320.
const KOBO_PER_KM: Record<
  CabinClass,
  { adult: number; minor: number }
> = {
  business: { adult: 350, minor: 350 }, // ≈ ₦560 for full route
  standard: { adult: 200, minor: 175 }, // ≈ ₦320 / ₦280 for full route
  first: { adult: 500, minor: 500 }, // ≈ ₦800 for full route
};

async function seed() {
  console.log("seeding stations...");
  const stationRows = STATIONS_DATA.map((s) => ({
    ...s,
    id: prefixedId(ID_PREFIXES.station),
  }));
  await db.insert(stations).values(stationRows);

  const stationMap = Object.fromEntries(
    stationRows.map((s) => [s.code, s.id]),
  );

  console.log("seeding trains and stops...");
  for (const train of TRAINS_DATA) {
    const trainId = prefixedId(ID_PREFIXES.train);
    await db.insert(trains).values({
      runsOnDays: train.runsOnDays,
      direction: train.direction,
      code: train.code,
      name: train.name,
      type: train.type,
      id: trainId,
    });

    await db.insert(trainStops).values(
      train.stops.map((stop, idx) => ({
        id: prefixedId(ID_PREFIXES.trainStop),
        stationId: stationMap[stop.station],
        departureTime: stop.departure,
        arrivalTime: stop.arrival,
        distanceKm: stop.distance,
        sequence: idx + 1,
        trainId,
      })),
    );

    console.log("seeding coaches and seats for", train.code);
    const classConfigs: CabinClass[] = ["first", "business", "standard"];
    for (const cls of classConfigs) {
      const layout = SEAT_LAYOUTS[cls];
      for (let c = 1; c <= layout.coachCount; c++) {
        const coachId = prefixedId(ID_PREFIXES.coach);
        const coachNumber = `C${String(c).padStart(2, "0")}`;
        await db.insert(coaches).values({
          totalSeats: layout.seatsPerCoach,
          coachNumber,
          id: coachId,
          class: cls,
          trainId,
        });

        const seatRows = Array.from(
          { length: layout.seatsPerCoach },
          (_, i) => ({
            id: prefixedId(ID_PREFIXES.seat),
            status: "available" as const,
            seatNumber: i + 1,
            coachId,
          }),
        );
        await db.insert(seats).values(seatRows);
      }
    }
  }

  console.log("seeding pricing for all station pairs...");
  // Each station has a position (1-9) and is 20 km from the next.
  // Distance between two stations = |position_a - position_b| * 20 km.
  const pricingRows = [];
  for (const a of STATIONS_DATA) {
    for (const b of STATIONS_DATA) {
      if (a.code === b.code) continue;
      const distanceKm = Math.abs(a.position - b.position) * 20;
      for (const cls of ["first", "business", "standard"] as CabinClass[]) {
        for (const paxType of ["adult", "minor"] as const) {
          pricingRows.push({
            amountKobo: calculatePrice(distanceKm, KOBO_PER_KM[cls][paxType]),
            destinationStationId: stationMap[b.code],
            originStationId: stationMap[a.code],
            id: prefixedId(ID_PREFIXES.pricing),
            passengerType: paxType,
            class: cls,
          });
        }
      }
    }
  }
  await db.insert(pricing).values(pricingRows);

  console.log("seed complete!");
}

// Round to nearest 100 kobo (₦1) to keep prices clean.
function calculatePrice(distanceKm: number, perKmKobo: number): number {
  return Math.round((distanceKm * perKmKobo) / 100) * 100;
}

seed().catch((err) => {
  console.error("seed failed:", err);
  process.exit(1);
});
