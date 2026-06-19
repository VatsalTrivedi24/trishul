# TRISHUL — Identity Trust Engine (Demo)

A proof-of-concept for continuous, risk-based identity trust in digital banking,
built for the Bank of Baroda Hackathon 2026 (academic partner: IIT Gandhinagar).

**Risk addressed:** Suspicious Account Recovery.

## The idea
Account recovery is the weakest door in digital banking. Instead of a fixed
OTP for everyone, TRISHUL scores every recovery attempt in real time (the
Identity Trust Score, 0–1000) and spends *friction* only when risk is elevated.
A genuine owner recovers in one tap; an attacker hits a 24h cooling-off wall.

## Two demo journeys
- `/simulate/genuine` — Kabir Rao recovers from his own trusted device. Trust
  builds to 880 → frictionless biometric approval.
- `/simulate/threat`  — the same account, attacked (new device, SIM swapped 6h
  ago, datacenter IP). Trust collapses to 215 → recovery halted, fraud ring
  surfaced, case auto-filed.

## How it's built
- **Frontend** (browser): the landing page + the live dashboard (gauge, signal
  ledger, blooming identity graph). Next.js + React + custom Tailwind.
- **Backend** (server): `/api/scenario` returns the scored timeline as JSON.
  The trust verdict is produced server-side — the browser only displays it.
- **Real vs simulated:** the behavioural (keystroke-dynamics) signal is the
  live sensor; other signals are scripted for the POC and each names its real
  production data source in the UI.

## Run locally
```bash
npm install
npm run dev   # http://localhost:3000
```
