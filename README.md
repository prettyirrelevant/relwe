# Rélwè

A proof of concept rebuild of the [NRC Lagos to Ibadan train booking platform](https://nrc.gsds.ng), with visual seat selection and cNGN payments on Solana.

> Heads up: this is just for fun. NIN verification is stubbed (any 11 digit number works), payments run on Solana devnet, and there are no emails. Tickets download straight from the trip page.

## What it does

- Search trains between any of the 9 stations on the Lagos to Ibadan corridor.
- Pick your seats on a visual coach map. Soft holds use atomic `SELECT FOR UPDATE` updates so two people can't grab the same seat.
- Pay with cNGN on Solana. Each booking gets its own HD derived wallet address, and the booking page polls the token balance and confirms automatically.
- Download a QR ticket for every passenger and show it at the station.

## Stack

- Next.js 16 (App Router) and TypeScript
- Tailwind v4 with Fraunces and Atkinson Hyperlegible Next
- Drizzle ORM on TiDB Serverless (MySQL)
- better-auth for sessions and the stubbed NIN signup
- Solana web3.js and @noble/hashes for HD wallet derivation

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
| `/book/[id]/checkout` | Passenger details and cNGN payment |
| `/trips` | User's bookings |
| `/trips/[id]` | Booking detail with downloadable QR tickets |
| `/timetable` | Full daily schedule |
| `/help` | FAQ |
| `/contact`, `/privacy` | Footer pages |

## Credits

Real station and train data come from the [Nigerian Railway Corporation](https://nrc.gov.ng). Built as a personal exploration, not affiliated with the NRC.
