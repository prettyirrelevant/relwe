export const CABIN_CLASS = {
  business: "business",
  standard: "standard",
  first: "first",
} as const;

export type CabinClass = (typeof CABIN_CLASS)[keyof typeof CABIN_CLASS];

export const CABIN_CLASS_DISPLAY: Record<CabinClass, string> = {
  business: "Business Class",
  standard: "Standard Class",
  first: "First Class",
};

export const SEAT_LAYOUTS: Record<
  CabinClass,
  { columns: ("aisle" | "seat")[]; seatsPerCoach: number; coachCount: number; }
> = {
  business: {
    columns: ["seat", "seat", "aisle", "seat", "seat"],
    seatsPerCoach: 56,
    coachCount: 2,
  },
  standard: {
    columns: ["seat", "seat", "aisle", "seat", "seat"],
    seatsPerCoach: 88,
    coachCount: 6,
  },
  first: {
    columns: ["seat", "aisle", "seat", "seat"],
    seatsPerCoach: 24,
    coachCount: 1,
  },
};

export const PASSENGER_TYPE = {
  adult: "adult",
  minor: "minor",
} as const;

export type PassengerType =
  (typeof PASSENGER_TYPE)[keyof typeof PASSENGER_TYPE];

export const SEAT_STATUS = {
  available: "available",
  reserved: "reserved",
  booked: "booked",
  held: "held",
} as const;

export type SeatStatus = (typeof SEAT_STATUS)[keyof typeof SEAT_STATUS];

export const PAYMENT_STATUS = {
  confirmed: "confirmed",
  expired: "expired",
  pending: "pending",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const TICKET_STATUS = {
  cancelled: "cancelled",
  valid: "valid",
  used: "used",
} as const;

export type TicketStatus =
  (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export const TRAIN_DIRECTION = {
  ibadanToLagos: "ibadan-lagos",
  lagosToIbadan: "lagos-ibadan",
} as const;

export type TrainDirection =
  (typeof TRAIN_DIRECTION)[keyof typeof TRAIN_DIRECTION];

export const TRAIN_TYPE = {
  allStops: "all-stops",
  express: "express",
} as const;

export type TrainType = (typeof TRAIN_TYPE)[keyof typeof TRAIN_TYPE];

export const HOLD_DURATION_MS = 5 * 60 * 1000; // 5 minutes
export const RESERVATION_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const PAYMENT_POLL_INTERVAL_MS = 4 * 1000; // 4 seconds

export const SOLANA_CONFIG = {
  rpcEndpoint:
    process.env.SOLANA_RPC_ENDPOINT ?? "https://api.devnet.solana.com",
  cngnMint: "HfJWS8vJHvxKn5xW3uLXkTmEy4jny3G45QnS1Eab5sg",
  masterSeed: process.env.SOLANA_MASTER_SEED ?? "",
} as const;
