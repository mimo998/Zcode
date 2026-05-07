import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./auth.js";

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
  // Tiny request logger
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    console.log(`→ ${request.method} ${url.pathname}`);
  })
  .get("/health", () => ({
    ok: true,
    service: "codequest-api",
    uptime: Math.floor((Date.now() - startedAt) / 1000),
  }))
  // The web app proxies /api/* to this server in dev
  .group("/api", (api) =>
    api
      .get("/health", () => ({
        ok: true,
        service: "codequest-api",
        uptime: Math.floor((Date.now() - startedAt) / 1000),
      }))
      .use(authRoutes)
  )
  .listen(PORT, ({ hostname, port }) => {
    console.log(`🦊 codequest-api listening on http://${hostname}:${port}`);
  });

export type App = typeof app;