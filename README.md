# Rélwè

A modern PoC rebuild of the [NRC Lagos–Ibadan train booking platform](https://nrc.gsds.ng).
Visual seat selection, cNGN payments on Solana, and signed QR tickets.

> **Note:** This is a proof of concept built for fun. NIN verification is stubbed (any 11-digit number works), payments run on Solana devnet, and emails are not sent — tickets are downloaded directly from the trip page.

## What it does

- **Search trains** between any of the 9 stations on the Lagos–Ibadan corridor.
- **Pick your seats** on a visual coach map. Soft holds prevent double-booking with `SELECT FOR UPDATE`–backed atomic updates.
- **Pay with cNGN** on Solana. Each booking gets a unique HD-derived wallet address. The booking page polls the wallet's token balance and confirms automatically.
- **Download QR tickets** for each passenger. Tickets are HMAC-signed so they can be verified at the station.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind v4** + Fraunces / Atkinson Hyperlegible Next
- **Drizzle ORM** + **TiDB Serverless** (MySQL)
- **better-auth** for sessions and stubbed NIN signup
- **Solana web3.js** + **@noble/hashes** for HD wallet derivation

## Local development

```bash
pnpm install
cp .env.example .env.local
# fill in DATABASE_URL, BETTER_AUTH_SECRET, SOLANA_MASTER_SEED, etc.

pnpm db:push     # apply schema to your database
pnpm db:seed     # seed stations, trains, coaches, seats, pricing
pnpm dev
```

## Deploy

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set environment variables (see `.env.example`).
4. Deploy.

## Routes

| Path | Description |
| --- | --- |
| `/` | Landing page with the search widget |
| `/trains` | Train results for a route |
| `/book/[id]/seats` | Seat picker |
| `/book/[id]/checkout` | Passenger details + cNGN payment |
| `/trips` | User's bookings |
| `/trips/[id]` | Booking detail with downloadable QR tickets |
| `/timetable` | Full daily schedule |
| `/help` | FAQ |
| `/contact`, `/privacy` | Footer pages |

## Credits

- Real station and train data sourced from the [Nigerian Railway Corporation](https://nrc.gov.ng).
- Built as a personal exploration. Not affiliated with the NRC.
