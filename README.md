# TALENTARC

A polished recruitment workspace built with React, Vite, TypeScript, Tailwind CSS, React Router, and Lucide icons.

## Run

```sh
npm install
npm run dev
```

`npm run build` produces the production bundle. `npm run preview` serves it locally.

## Views

- `/dashboard` — hiring metrics, application trends, live pipeline counts, roles, interviews, candidates, and sourcing channels.
- `/jobs` — card/table layouts, search, status filters, validated creation, and editing.
- `/candidates` — searchable and sortable database, role/stage/skill filters, favorites, pagination, row selection, bulk stage updates, CSV export, and profile drawers with notes.
- `/pipeline` — five hiring stages with reliable status selectors and live counts.
- `/interviews` — week calendar and list, interview details, participants, and mock rescheduling.
- `/messages` — searchable inbox, unread filters, read status, and local replies.

Theme, navigation preference, candidate filters, candidate changes, jobs, interview changes, and messages persist in localStorage. All people and opportunities are fictional. The dashboard’s trend chart, comparison metrics, and historical time-to-hire are illustrative; current candidate and job counts derive from shared local data. The calendar’s sample week starts September 28, 2026, in SAST.

No backend, auth, external job publication, email delivery, or calendar invitations. Avatar images use a small set of Unsplash URLs with initials as a graceful fallback. Google Fonts have system sans-serif fallbacks. For deployment, configure your host to serve `index.html` for the app’s routes.
