const STATION_NAMES = [
  "Ebute Metta",
  "Agege",
  "Agbado",
  "Kajola",
  "Papalanto",
  "Abeokuta",
  "Olodo",
  "Omi-Adio",
  "Moniya",
];

export function RouteInfo() {
  return (
    <section className="bg-primary text-text-inverse">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <p className="font-heading text-2xl md:text-3xl leading-snug">
          Lagos to Ibadan. 180 km. 9 stations.
        </p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-base text-text-inverse/70">
          {STATION_NAMES.map((name, idx) => (
            <li className="flex items-center gap-3" key={name}>
              <span className="whitespace-nowrap">{name}</span>
              {idx < STATION_NAMES.length - 1 && (
                <span className="text-text-inverse/20" aria-hidden>·</span>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-base text-text-inverse/60 leading-relaxed max-w-lg mx-auto">
          8 daily trains. Choose your seat. Pay with cNGN on Solana, and
          your QR ticket is ready in seconds.
        </p>
      </div>
    </section>
  );
}
