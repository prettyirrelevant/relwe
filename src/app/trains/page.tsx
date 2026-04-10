import { ProgressBar } from "~/components/booking/progress-bar";
import { type TrainResult, searchTrains } from "~/lib/queries";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";

import { TrainCard } from "./_components/train-card";

export default async function TrainsPage({
  searchParams,
}: {
  searchParams: Promise<{ passengers?: string; date?: string; from?: string; to?: string; }>;
}) {
  const params = await searchParams;
  const { passengers, date, from, to } = params;

  let trainResults: TrainResult[] = [];
  let error = "";

  if (from && to && date) {
    try {
      trainResults = await searchTrains(from, to, date);
    } catch {
      error = "Failed to search trains. Please try again.";
    }
  }

  const searchParamsString = new URLSearchParams({
    passengers: passengers ?? "1",
    date: date ?? "",
    from: from ?? "",
    to: to ?? "",
  }).toString();

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
          <ProgressBar currentStep={0} />

          <h1 className="font-heading text-[32px] text-primary mt-6 mb-8">
            Available trains
          </h1>

          {error && (
            <p className="text-error text-sm mb-6">{error}</p>
          )}

          {!from || !to || !date ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg">
                Search for trains from the home page.
              </p>
            </div>
          ) : trainResults.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-heading text-xl text-text mb-2">
                No trains found
              </h2>
              <p className="text-muted">
                No trains available for this route and date. Try a different date?
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {trainResults.map((train) => (
                <TrainCard
                  key={train.id}
                  {...train}
                  searchParams={searchParamsString}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
