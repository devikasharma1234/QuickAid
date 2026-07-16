# QuickAid 🚑

**Real-time hospital bed & ambulance dispatch OS**

QuickAid is a live dashboard that tracks hospital bed availability across a city, routes ambulances to the best-suited ER in real time, and auto-alerts triage staff before the patient arrives. A pub-sub WebSocket backbone keeps every client in sync as conditions change.

🔗 **Live demo:** [quick-aid-xi.vercel.app](https://quick-aid-xi.vercel.app)

---

## What it does (so far)

- **Live bed availability dashboard** — surfaces which hospitals in the city currently have open beds, so dispatchers aren't calling around blind.
- **Ambulance routing** — directs an incoming ambulance to the nearest/best-matched ER based on current capacity.
- **Pre-arrival triage alerts** — notifies hospital triage staff before the ambulance reaches the ER, so the team can prep.
- **Location via SMS** (`sms_location/`) — a fallback channel for capturing/reporting location data over SMS using Twilio, for cases where a full app connection isn't available.
- **Real-time sync** — a pub-sub WebSocket layer keeps the dashboard, ambulances, and hospitals updated live rather than on manual refresh.

## Tech Stack

- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL via [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `pg`)
- **Messaging/Alerts:** Twilio (`twilio`) — used for the SMS-based location flow
- **Frontend:** HTML/JS served from `public/`
- **Deployment:** Vercel (`vercel.json`)
- **Other:** `dotenv` for config, `uuid` for ID generation, ES modules (`"type": "module"`)

## Project Structure

```
QuickAid/
├── public/           # Frontend (dashboard UI)
├── sms_location/      # SMS-based location capture/reporting (Twilio)
├── index.js          # Entry point
├── server.js          # Express server + WebSocket setup
├── supabase.js         # Supabase client/config
├── vercel.json         # Vercel deployment config
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A [Supabase](https://supabase.com/) project (Postgres database)
- A [Twilio](https://www.twilio.com/) account (for SMS features)

### Installation

```bash
git clone https://github.com/devikasharma1234/QuickAid.git
cd QuickAid
npm install
```

### Environment Variables

Create a `.env` file in the root directory with:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_or_service_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Run locally

```bash
node server.js
```

The server will start and serve the dashboard from `public/`.

## Status

This project is a work in progress, currently being built out as a hackathon submission (team: QuickAid). Core pieces in place: Express backend, Supabase/Postgres integration, and an SMS location module. Ambulance routing logic, the live WebSocket dashboard, and triage alerting are being actively developed.

## Team

Built by Devika Sharma and team, UIET Kurukshetra.

## License

No license specified yet.
