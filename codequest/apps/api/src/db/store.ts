import { JSONFilePreset } from "lowdb/node";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DATABASE_PATH ?? "./data/codequest.json";
mkdirSync(dirname(DB_PATH), { recursive: true });

export type Role = "student" | "teacher" | "admin";

export interface UserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: Role;
  total_score: number;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Sessions: one row per game-attempt by a student                    */
/* ------------------------------------------------------------------ */

export type SessionStatus = "active" | "completed" | "abandoned";

export interface SessionRow {
  id: number;
  studentId: number;
  gameId: string;       // string, e.g. "fix-the-loop" — matches games registry
  gameTitle: string;    // captured at session start so summary survives game edits
  startedAt: string;
  completedAt: string | null;
  finalScore: number | null;
  status: SessionStatus;
  // Append-only event log
  events: SessionEvent[];
  // Cached AI summary (filled in on completion)
  summary: string | null;
}

export type SessionEvent =
  | { type: "attempt"; at: string; payload: { code?: string; answer?: string; passed: boolean; error?: string } }
  | { type: "hint_request"; at: string; payload: { studentMessage?: string } }
  | { type: "hint_given"; at: string; payload: { hint: string } }
  | { type: "completed"; at: string; payload: { score: number } };

interface DBShape {
  users: UserRow[];
  sessions: SessionRow[];
  nextUserId: number;
  nextSessionId: number;
}

const defaultData: DBShape = { users: [], sessions: [], nextUserId: 1, nextSessionId: 1 };

export const db = await JSONFilePreset<DBShape>(DB_PATH, defaultData);

// Migrate existing dbs that have `nextId` instead of `nextUserId`/`nextSessionId`
if ((db.data as any).nextId !== undefined && db.data.nextUserId === undefined) {
  db.data.nextUserId = (db.data as any).nextId;
  delete (db.data as any).nextId;
}
db.data.sessions ??= [];
db.data.nextSessionId ??= 1;
await db.write();

/* ------------------------------------------------------------------ */
/*  User store                                                         */
/* ------------------------------------------------------------------ */

export const userStore = {
  async create(email: string, name: string, passwordHash: string, role: Role): Promise<UserRow> {
    const user: UserRow = {
      id: db.data.nextUserId,
      email, name, password_hash: passwordHash, role,
      total_score: 0,
      created_at: new Date().toISOString(),
    };
    db.data.users.push(user);
    db.data.nextUserId++;
    await db.write();
    return user;
  },
  findByEmail(email: string)         { return db.data.users.find((u) => u.email === email); },
  findById(id: number)               { return db.data.users.find((u) => u.id === id); },
  all()                              { return [...db.data.users].sort((a, b) => b.created_at.localeCompare(a.created_at)); },

  async setRole(id: number, role: Role) {
    const u = db.data.users.find((u) => u.id === id);
    if (!u) return false;
    u.role = role;
    await db.write();
    return true;
  },
  async delete(id: number) {
    const idx = db.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    db.data.users.splice(idx, 1);
    await db.write();
    return true;
  },
  async addScore(id: number, delta: number) {
    const u = db.data.users.find((u) => u.id === id);
    if (!u) return false;
    u.total_score += delta;
    await db.write();
    return true;
  },
  async upsertAdmin(email: string, name: string, passwordHash: string): Promise<UserRow> {
    const existing = db.data.users.find((u) => u.email === email);
    if (existing) {
      existing.role = "admin";
      existing.name = name;
      existing.password_hash = passwordHash;
      await db.write();
      return existing;
    }
    return this.create(email, name, passwordHash, "admin");
  },
};

/* ------------------------------------------------------------------ */
/*  Session store                                                      */
/* ------------------------------------------------------------------ */

export const sessionStore = {
  async start(studentId: number, gameId: string, gameTitle: string): Promise<SessionRow> {
    const session: SessionRow = {
      id: db.data.nextSessionId,
      studentId, gameId, gameTitle,
      startedAt: new Date().toISOString(),
      completedAt: null,
      finalScore: null,
      status: "active",
      events: [],
      summary: null,
    };
    db.data.sessions.push(session);
    db.data.nextSessionId++;
    await db.write();
    return session;
  },

  findById(id: number) { return db.data.sessions.find((s) => s.id === id); },

  forStudent(studentId: number) {
    return db.data.sessions
      .filter((s) => s.studentId === studentId)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  },

  async appendEvent(id: number, ev: SessionEvent) {
    const s = db.data.sessions.find((s) => s.id === id);
    if (!s || s.status !== "active") return null;
    s.events.push(ev);
    await db.write();
    return s;
  },

  async complete(id: number, score: number, summary: string | null) {
    const s = db.data.sessions.find((s) => s.id === id);
    if (!s) return null;
    s.status = "completed";
    s.completedAt = new Date().toISOString();
    s.finalScore = score;
    s.summary = summary;
    s.events.push({ type: "completed", at: s.completedAt, payload: { score } });
    await db.write();
    return s;
  },
};
