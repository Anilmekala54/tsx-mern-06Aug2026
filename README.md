# Holoarchive — Star Wars Character Census

A React + TypeScript app that browses the [SWAPI](https://swapi.info) character catalog: searchable, filterable,
paginated cards with species-based color coding, a details modal with homeworld lookup, mock JWT authentication with
silent refresh, and an integration test covering the modal flow.

> Screenshots: add 2-3 screenshots here after deploying (login screen, character grid, character modal). See
> [Submission checklist](#submission-checklist) below.

## Tech stack

- React 19 + TypeScript, built with Vite
- **Tailwind CSS v4** (via `@tailwindcss/vite`), with the visual design tokens (colors, fonts) mapped through
  Tailwind's `@theme` in `src/index.css` so utilities like `bg-panel`, `text-accent`, `font-display` are available
  everywhere
- Vitest + React Testing Library for the integration test
- Data source: [swapi.info](https://swapi.info) (`/people`, `/species`, `/films`, `/planets`)

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # type-check + production build to dist/
npm run test        # run the integration test
npm run preview     # preview the production build locally
```

## Demo login

The API itself needs no auth, so login is mocked entirely client-side to demonstrate the JWT flow requested in the
assignment (see [Auth design](#auth-design)):

- **Username:** `jedi_candidate`
- **Password:** `UseTheForce123`

## Feature checklist (core assignment)

- [x] Lists all characters from `/people`, paginated (12 per page)
- [x] Loading state while fetching/refetching
- [x] Error state if the API is unreachable, with a retry action
- [x] Character cards: name + a picture per character (Picsum, seeded per character id)
- [x] Cards colored by species, with a hover animation (lift, glow, corner brackets, scanline)
- [x] Click a card → modal with more details
- [x] Light/dark theme toggle (not required by the assignment doc — added on request; persisted in `localStorage`, respects system preference on first visit)
- [x] Modal shows: name (header), height in meters, mass in kg, date added (`dd-MM-yyyy`), number of films,
      birth year
- [x] Modal fetches and shows homeworld: name, terrain, climate, and resident count

## Feature checklist (bonus)

- [x] **Search + filter**: search by name (partial match) combined with species / homeworld / film filters,
      all AND-ed together
- [x] **JWT auth**: mocked login/logout, access + refresh tokens, silent refresh before the access token expires
      (see [Auth design](#auth-design))
- [x] **Integration test**: `src/App.test.tsx` logs in, opens a specific character's card, and asserts the modal
      shows that character's own data (not a neighboring card's)

## Architecture notes

```
src/
  api.ts                 fetch wrappers for swapi.info, with a typed ApiError
  types.ts                SWAPI response shapes + idFromUrl helper
  utils/format.ts         date/unit formatting, species color mapping, portrait URLs
  auth/
    mockJwt.ts             fake JWT issue/verify/refresh (client-only, clearly commented as a mock)
    AuthContext.tsx         React context: login/logout, schedules silent refresh via setTimeout
  hooks/useSwapiData.ts   loads people + species + films + planets once, exposes loading/error/reload
  theme/ThemeContext.tsx  light/dark toggle, persisted + system-preference-aware
  components/
    LoginForm, Header
    SearchFilterBar, CharacterBrowser   search/filter/pagination orchestration
    CharacterCard, CharacterModal
    Pagination, Loader, ErrorState
```

**Pagination**: swapi.info returns the entire `/people` collection in one response (no `next`/`previous`/paging
params, unlike the original swapi.dev). Pagination is therefore implemented client-side over the fetched array —
still exercising the same UI/UX concerns (page state, boundaries, resetting to page 1 on filter changes) the
assignment is testing for.

**Species color coding**: each person's first `species` URL is resolved to a name (defaulting to "Human" when the
list is empty, matching SWAPI's convention). A curated palette covers common species, with a stable hash-based
fallback for anything else, so colors don't shift between renders.

**Auth design**: `mockJwt.ts` issues short-lived (60s) access tokens and long-lived (8h) refresh tokens, base64url
encoded with a demo-only checksum "signature" (not real cryptography — there's no real backend to protect).
`AuthContext` decodes the access token's `exp`, schedules a refresh 5s before expiry via `setTimeout`, and swaps in
new tokens transparently. The access lifetime is intentionally short so the silent-refresh cycle is visible during
review instead of only after 15+ minutes.

## Submission checklist

- [ ] Repo named `tsx-mern-<date_of_submission>` (e.g. `tsx-mern-06Aug2026`)
- [ ] Push this project to that GitHub repo
- [ ] Deploy `dist/` (or connect the repo) to Netlify/Vercel
- [ ] Add screenshots to this README
- [ ] Record a short video walking through the app + code
- [ ] Fill out the assignment submission form with: GitHub link, hosted app link, video link
