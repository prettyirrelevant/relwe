import {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hkdf } from "@noble/hashes/hkdf.js";

import { SOLANA_CONFIG } from "./constants";

const connection = new Connection(SOLANA_CONFIG.rpcEndpoint);
const cngnMint = new PublicKey(SOLANA_CONFIG.cngnMint);

// cNGN is a Token-2022 mint with 6 decimals
const CNGN_DECIMALS = 6;
// 1 kobo = 10^(decimals - 2) base units = 10^4 = 10_000
const KOBO_TO_BASE_UNITS = BigInt(10 ** (CNGN_DECIMALS - 2));

/**
 * Check the cNGN balance of a booking's derived wallet.
 * Returns the raw balance in token base units (smallest denomination).
 */
export async function getBookingCngnBalance(
  bookingId: string,
): Promise<bigint> {
  const keypair = deriveBookingKeypair(bookingId);

  try {
    const ata = await getAssociatedTokenAddress(
      cngnMint,
      keypair.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
    );
    const account = await getAccount(
      connection,
      ata,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    return account.amount;
  } catch {
    // token account doesn't exist yet
    return BigInt(0);
  }
}

/**
 * Derive a unique Solana keypair for a booking using HKDF.
 * masterSeed + bookingId → deterministic 32-byte seed → Keypair
 */
export function deriveBookingKeypair(bookingId: string): Keypair {
  const masterSeed = SOLANA_CONFIG.masterSeed;
  if (!masterSeed) {
    throw new Error("SOLANA_MASTER_SEED is not configured");
  }

  const derived = hkdf(
    sha256,
    new TextEncoder().encode(masterSeed),
    new TextEncoder().encode(bookingId),
    new TextEncoder().encode("relwe-booking-wallet"),
    32,
  );

  return Keypair.fromSeed(derived);
}

/**
 * Check if a booking has been paid.
 * cNGN has 6 decimals, so 1 cNGN = 1_000_000 base units, 1 kobo = 10_000 base units.
 */
export async function checkPayment(
  bookingId: string,
  expectedAmountKobo: number,
): Promise<{ expected: bigint; balance: bigint; paid: boolean; }> {
  const balance = await getBookingCngnBalance(bookingId);
  const expected = BigInt(expectedAmountKobo) * KOBO_TO_BASE_UNITS;

  return {
    paid: balance >= expected,
    expected,
    balance,
  };
}

/**
 * Get the public key (wallet address) for a booking.
 */
export function getBookingWalletAddress(bookingId: string): string {
  return deriveBookingKeypair(bookingId).publicKey.toBase58();
}
