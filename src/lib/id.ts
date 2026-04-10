import { init } from "@paralleldrive/cuid2";

const createId = init({ length: 16 });

export function prefixedId(prefix: string): string {
  return `${prefix}_${createId()}`;
}

export const ID_PREFIXES = {
  bookingPassenger: "psgr",
  trainStop: "tstp",
  booking: "bkng",
  pricing: "prc",
  station: "stn",
  ticket: "tkt",
  coach: "cch",
  train: "trn",
  seat: "st",
} as const;
