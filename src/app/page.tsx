import { DepartureTicker } from "~/components/layout/departure-ticker";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { stations } from "~/db/schema";
import { db } from "~/db";

import { RouteInfo } from "./_components/route-info";
import { Hero } from "./_components/hero";

export default async function HomePage() {
  let stationList: Awaited<ReturnType<typeof getStations>> = [];

  try {
    stationList = await getStations();
  } catch {
    // DB not connected yet
  }

  return (
    <>
      <Header />
      <DepartureTicker departures={[]} />
      <main className="flex-1">
        <Hero
          stations={stationList.map((s) => ({
            area: s.area,
            code: s.code,
            name: s.name,
            id: s.id,
          }))}
        />
        <RouteInfo />
      </main>
      <Footer />
    </>
  );
}

async function getStations() {
  return db.select().from(stations).orderBy(stations.position);
}
