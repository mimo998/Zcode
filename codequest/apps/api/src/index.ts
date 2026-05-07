import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { cors } from "@elysiajs/cors";

const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const startedAt = Date.now();

const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    }),
  )
  // Tiny request logger so you can see traffic in dev. Keep it light — swap for pino later.
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    console.log(`→ ${request.method} ${url.pathname}`);
  })
  .get("/health", () => ({
    ok: true,
    service: "codequest-api",
    uptime: Math.floor((Date.now() - startedAt) / 1000),
  }))
  // The web app proxies /api/* to this server in dev, so everything sits under /api.
  .group("/api", (api) =>
    api.get("/health", () => ({
      ok: true,
      service: "codequest-api",
      uptime: Math.floor((Date.now() - startedAt) / 1000),
    })),
  )
  .listen(PORT, ({ hostname, port }) => {
    console.log(`🦊 codequest-api listening on http://${hostname}:${port}`);
  });

export type App = typeof app;
