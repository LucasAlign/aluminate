# Aluminate

Phase 1 MVP for the Emerging Entrepreneurs Academy alumni platform.

## Stack

- Next.js App Router
- TypeScript
- Custom CSS with the Phase 1 visual system
- Firebase Auth-ready environment placeholders
- Firebase SQL Connect schema and connector files

## Current MVP Surface

- Alumni and Admin login paths
- Role-gated navigation, with Admin hidden from alumni
- Community feed
- Compact spreadsheet-style alumni directory
- Editable alumni profile modal
- Learning hub
- Support center
- Admin dashboard, reports, moderation shortcuts, and roster import panel

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

On Windows PowerShell, use `npm.cmd install` and `npm.cmd run dev` if script execution policy blocks `npm.ps1`.

## Firebase

Copy `.env.example` to `.env.local` and fill in the Firebase web app values. The app currently runs with local seed data; the SQL Connect files remain in `schema.gql` and `connector.gql`, with the existing generated SDK example in `src/AlumniByYear.tsx`.

## Import Notes

CSV import works client-side for the MVP. The Admin UI accepts Excel files, but Excel persistence should be wired through a backend parser during the Firebase/SQL Connect integration step.
