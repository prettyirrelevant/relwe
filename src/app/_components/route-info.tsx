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

        <p className="mt-8 text-base md:text-lg text-text-inverse/50 leading-relaxed">
          {STATION_NAMES.map((name, idx) => (
            <span key={name}>
              <span className="text-text-inverse/80">{name}</span>
              {idx < STATION_NAMES.length - 1 && (
                <span className="mx-2 text-text-inverse/20">·</span>
              )}
            </span>
          ))}
        </p>

        <p className="mt-10 text-base text-text-inverse/60 leading-relaxed max-w-lg mx-auto">
          8 daily trains. Choose your seat. Pay with USDC on Solana. Your QR
          ticket arrives in seconds.
        </p>
      </div>
    </section>
  );
}
