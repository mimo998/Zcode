import { Elysia, t } from "elysia";
import { sessionStore, userStore } from "./db/store.js";
import { getUserFromHeaders } from "./auth.js";
import { buildMentorMessages, buildSummaryMessages, type MentorContext } from "./mentor.js";
import { chat, OpenRouterError } from "./openrouter.js";

export const sessionRoutes = new Elysia({ prefix: "/sessions" })

  // ── Start a session ──────────────────────────────────────────────
  .post(
    "/start",
    async ({ headers, body, set }) => {
      const user = getUserFromHeaders(headers as any);
      if (!user || user.role !== "student") {
        set.status = 403;
        return { success: false, message: "Only students can start sessions" };
      }
      const session = await sessionStore.start(user.id, body.gameId, body.gameTitle);
      return { success: true, sessionId: session.id };
    },
    { body: t.Object({ gameId: t.String(), gameTitle: t.String() }) },
  )

  // ── Log an attempt (passed or failed) ────────────────────────────
  .post(
    "/:id/attempt",
    async ({ headers, params, body, set }) => {
      const user = getUserFromHeaders(headers as any);
      const session = sessionStore.findById(Number(params.id));
      if (!user || !session || session.studentId !== user.id) {
        set.status = 403;
        return { success: false, message: "Not your session" };
      }
      await sessionStore.appendEvent(session.id, {
        type: "attempt",
        at: new Date().toISOString(),
        payload: { code: body.code, answer: body.answer, passed: body.passed, error: body.error },
      });
      return { success: true };
    },
    {
      body: t.Object({
        passed: t.Boolean(),
        code: t.Optional(t.String()),
        answer: t.Optional(t.String()),
        error: t.Optional(t.String()),
      }),
    },
  )

  // ── Request a hint from the AI mentor ────────────────────────────
  .post(
    "/:id/hint",
    async ({ headers, params, body, set }) => {
      const user = getUserFromHeaders(headers as any);
      const session = sessionStore.findById(Number(params.id));
      if (!user || !session || session.studentId !== user.id) {
        set.status = 403;
        return { success: false, message: "Not your session" };
      }

      const hintsGivenSoFar = session.events.filter((e) => e.type === "hint_given").length;

      // Cap at 5 hints per session — protects against rate limit abuse
      if (hintsGivenSoFar >= 5) {
        return {
          success: true,
          hint: "You've used all your hints for this session — try working through it with what you have, or ask your teacher!",
          hintsRemaining: 0,
        };
      }

      // Log the request first so it survives even if the AI call fails
      await sessionStore.appendEvent(session.id, {
        type: "hint_request",
        at: new Date().toISOString(),
        payload: { studentMessage: body.studentMessage },
      });

      const ctx: MentorContext = {
        gameTitle: session.gameTitle,
        problemStatement: body.problemStatement,
        studentAttempt: body.studentAttempt,
        expectedBehavior: body.expectedBehavior,
        lastError: body.lastError,
        hintsGivenSoFar,
        studentMessage: body.studentMessage,
      };

      try {
        const hint = await chat(buildMentorMessages(ctx), { temperature: 0.6, maxTokens: 250 });
        await sessionStore.appendEvent(session.id, {
          type: "hint_given",
          at: new Date().toISOString(),
          payload: { hint },
        });
        return { success: true, hint, hintsRemaining: 4 - hintsGivenSoFar };
      } catch (err) {
        const e = err as OpenRouterError;
        console.error("Mentor error:", e.message);
        set.status = 502;
        return { success: false, message: "Mentor is unavailable right now. Try again in a moment." };
      }
    },
    {
      body: t.Object({
        problemStatement: t.String(),
        studentAttempt: t.Optional(t.String()),
        expectedBehavior: t.Optional(t.String()),
        lastError: t.Optional(t.String()),
        studentMessage: t.Optional(t.String()),
      }),
    },
  )

  // ── Complete the session, generate teacher summary ───────────────
  .post(
    "/:id/complete",
    async ({ headers, params, body, set }) => {
      const user = getUserFromHeaders(headers as any);
      const session = sessionStore.findById(Number(params.id));
      if (!user || !session || session.studentId !== user.id) {
        set.status = 403;
        return { success: false, message: "Not your session" };
      }
      if (session.status !== "active") {
        return { success: true, sessionId: session.id, summary: session.summary };
      }

      // Generate summary BEFORE marking complete so events list includes everything
      let summary: string | null = null;
      try {
        summary = await chat(
          buildSummaryMessages({ ...session, finalScore: body.score, status: "completed", completedAt: new Date().toISOString() }, user.name),
          { temperature: 0.3, maxTokens: 250 },
        );
      } catch (err) {
        console.error("Summary error:", (err as Error).message);
        // Non-fatal — session still completes, summary just absent
      }

      await sessionStore.complete(session.id, body.score, summary);
      // Bump student's total score
      await userStore.addScore(user.id, body.score);

      return { success: true, sessionId: session.id, summary };
    },
    { body: t.Object({ score: t.Number() }) },
  )

  // ── Student: list my sessions ────────────────────────────────────
  .get("/mine", ({ headers, set }) => {
    const user = getUserFromHeaders(headers as any);
    if (!user) { set.status = 401; return { success: false, message: "Auth required" }; }
    return { success: true, sessions: sessionStore.forStudent(user.id) };
  })

  // ── Teacher/admin: view a student's sessions ─────────────────────
  .get("/student/:studentId", ({ headers, params, set }) => {
    const user = getUserFromHeaders(headers as any);
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      set.status = 403;
      return { success: false, message: "Teacher or admin only" };
    }
    return { success: true, sessions: sessionStore.forStudent(Number(params.studentId)) };
  });
