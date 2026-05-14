# Zcode

Educational game platform for high school CS. Students learn algorithms, hardware, and 3D modeling by playing minigames with an AI mentor; teachers track progress through a dashboard.

> Status: pre-alpha. UI scaffolding in progress, games not yet implemented.

## What's in this repo

```
codequest/
├── apps/
│   ├── web/        Student + teacher frontend (React, Vite, R3F)
│   └── api/        Backend (Elysia.js, Postgres, Drizzle)
├── packages/
│   ├── games-sdk/  The contract every minigame implements
│   └── shared/     API types shared between web and api
└── docs/           Design docs and decisions
```

The repo is a `pnpm` workspace. All packages are TypeScript.

## Stack

| Layer            | Choice                                |
| ---------------- | ------------------------------------- |
| Frontend         | React 18 + Vite + TypeScript          |
| Styling          | Tailwind CSS                          |
| 3D / lobby       | React Three Fiber (`@react-three/fiber`) |
| Code editor      | Monaco (`@monaco-editor/react`)       |
| State            | Zustand                               |
| Routing          | React Router                          |
| Backend          | Elysia.js                             |
| ORM              | Drizzle                               |
| DB               | Postgres                              |
| Auth             | JWT (Elysia plugin)                   |
| AI mentor        | OpenRouter or Anthropic API direct    |
| Student-side code execution | Web Workers + iframe sandbox (JS), Pyodide (Python) |
| Hardware         | WebSerial API (Arduino, Chrome/Edge)  |

### Why these choices

- **TypeScript everywhere** — one language across web and api, shared types in `packages/shared` so contract drift becomes a compile error.
- **pnpm workspaces** over npm — faster, proper hoisting, cleaner monorepo support.
- **Elysia.js** over Express/Fastify — first-class TS, Bun-ready, end-to-end type safety into the frontend if we want it.
- **Drizzle** over Prisma — lighter, better TS inference, no codegen step.
- **Pyodide** for Python — runs Python in the browser (WASM). No server-side sandboxing headaches, no per-student container costs.
- **WebSerial** for Arduino — no driver install, no Arduino IDE, works on school Chromebooks. (Chrome/Edge only — Firefox doesn't support it. Acceptable tradeoff for a school deployment.)

## Quick start

Prereqs: Node 20+, pnpm 9+, Postgres 15+ running locally.

```bash
# Install everything
pnpm install

# Backend setup
cp apps/api/.env.example apps/api/.env       # fill in DATABASE_URL etc.
pnpm --filter @codequest/api db:migrate

# Run web + api in parallel
pnpm dev
```

Web runs on `http://localhost:5173`, API on `http://localhost:3001`.

## How games are integrated

This is the most important architectural decision in the project: **the lobby and the games are decoupled.** The lobby renders cards, handles routing, tracks progress, and surfaces the AI mentor — all without knowing what any specific game does.

Every game is a React component implementing the `GameDefinition` interface in `packages/games-sdk/src/index.ts`. To add a new game:

1. Build the game as a self-contained React component implementing the `GameProps` interface.
2. Export a `GameDefinition` describing it (id, name, levels, icon, etc.).
3. Add the definition to the registry in `apps/web/src/games/registry.ts`.

That's it. No lobby changes. No backend changes (beyond the db already supporting any `gameId` string).

This is what lets us build the UI now and drop games in later, in any order, in parallel — and what will let us add a fifth or sixth game in a year without touching the platform.

### Game contract (summary)

A game receives:

- `level`, the level the student is starting on
- `onLevelComplete(result)`, called when the student passes a level
- `onMentorRequest(context)`, called when the student wants help — the platform decides how to render the mentor
- `onExit()`, called when the student wants to leave

A game **never** talks to the backend or the AI directly. All progress and mentor state flows through the platform.

## The AI mentor

The mentor is a single shared service the platform exposes to all games. It follows a Socratic pattern: ask before answering, surface the smallest hint that gets the student unstuck, escalate only if needed.

When a game calls `onMentorRequest(context)`, it sends:

- the level the student is on
- what they're trying to do (`goal`)
- their current code or attempt
- any error message
- arbitrary game-specific context

The mentor uses this to give targeted hints, not generic answers. The same mentor works for every game — only the context differs.

## Contributing (during the build phase)

1. Pick an issue. We use a small label set:
   - `area:web` / `area:api` / `area:sdk` / `area:devops`
   - `type:feature` / `type:bug` / `type:chore` / `type:docs`
   - `priority:p0` / `p1` / `p2`
   - `good-first-issue` for newcomers
2. Branch off `main`: `git checkout -b feat/<short-name>` or `fix/<short-name>`.
3. Open a draft PR early. CI runs typecheck + lint on every push.
4. Request review when ready. Squash-merge.

Conventional commit prefixes for PR titles: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.

## Roadmap (high level)

- **M1 — Platform skeleton** *(now)*: monorepo, auth, lobby UI, teacher dashboard shell, mentor service, games SDK contract.
- **M2 — First game**: Maze Runner end-to-end as the reference implementation.
- **M3 — Software games**: Calculator Lab, then 3D Print Studio (JSCAD).
- **M4 — Hardware**: Arduino Workshop with WebSerial.
- **M5 — Pilot**: deploy, run with real students, iterate.

## Team

- Tamir Shibli (Mimo)
- *teammates TBD*

## License

TBD.
