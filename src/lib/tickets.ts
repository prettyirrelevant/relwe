import { createHmac } from "crypto";
import QRCode from "qrcode";

const HMAC_SECRET = process.env.TICKET_HMAC_SECRET ?? "dev-secret";

interface TicketPayload {
  passengerName: string;
  bookingRef: string;
  coach: string;
  route: string;
  date: string;
  seat: string;
}

export function verifyPayload(
  signed: string,
): { payload: TicketPayload; valid: true; } | { valid: false } {
  try {
    const decoded = JSON.parse(
      Buffer.from(signed, "base64url").toString("utf-8"),
    );
    const { signature, ...payload } = decoded;
    const expected = createHmac("sha256", HMAC_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (signature !== expected) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export function signPayload(payload: TicketPayload): string {
  const data = JSON.stringify(payload);
  const signature = createHmac("sha256", HMAC_SECRET)
    .update(data)
    .digest("hex");
  return Buffer.from(JSON.stringify({ ...payload, signature })).toString(
    "base64url",
  );
}

export async function generateQRCode(signed: string): Promise<string> {
  return QRCode.toDataURL(signed, {
    color: { light: "#fefae0", dark: "#1b4332" },
    width: 300,
    margin: 2,
  });
}
