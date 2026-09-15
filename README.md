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
- Public-source verification and provenance links for discoverable alumni
- Private messaging demo with an inbox, contact search, and locally persisted conversations
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

## Alumni Data Policy

The demo roster contains only alumni whose participation can be verified from public EEA or professional sources. It intentionally omits email addresses and phone numbers. Public profiles include a source link, uncertain cohort or school fields are labeled instead of guessed, and memorial profiles cannot receive messages.

This is a discoverable public roster, not an authoritative alumni database. Before launch, EEA should import its consented internal roster, let each alumnus claim and correct their own profile, and provide opt-out and visibility controls.

## Messaging

Messages work locally in demo mode and persist in the current browser. They do not contact real alumni. A production launch should connect conversations to the selected Firebase database, require authenticated membership, enforce participant-only security rules, add block/report controls, and define staff moderation and retention policies.

## Import Notes

CSV import works client-side for the MVP. The Admin UI accepts Excel files, but Excel persistence should be wired through a backend parser during the Firebase/SQL Connect integration step.
