import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userStore, type Role, type UserRow } from "./db/store.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key-change-this";
const SALT_ROUNDS = 10;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Admin";

(async () => {
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    await userStore.upsertAdmin(ADMIN_EMAIL, ADMIN_NAME, hash);
    console.log(`👑 admin ready: ${ADMIN_EMAIL}`);
  }
})();

function createJWT(userId: number, role: Role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}
function verifyJWT(token: string) {
  try { return jwt.verify(token, JWT_SECRET) as { userId: number; role: Role }; }
  catch { return null; }
}

const toApiUser = (u: UserRow) => ({ id: u.id, email: u.email, name: u.name, role: u.role });

export function getUserFromHeaders(headers: Record<string, string | undefined>): UserRow | null {
  const token = headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  const decoded = verifyJWT(token);
  if (!decoded) return null;
  return userStore.findById(decoded.userId) ?? null;
}

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body;
      const user = userStore.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        set.status = 401;
        return { success: false, message: "Invalid email or password" };
      }
      const token = createJWT(user.id, user.role);
      return { success: true, token, user: toApiUser(user) };
    },
    { body: t.Object({ email: t.String(), password: t.String() }) },
  )
  .post(
    "/signup",
    async ({ body, set }) => {
      const { email, password, name, role } = body;
      if (userStore.findByEmail(email)) {
        set.status = 409;
        return { success: false, message: "Email already in use" };
      }
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await userStore.create(email, name, passwordHash, role);
      const token = createJWT(user.id, user.role);
      return { success: true, token, user: toApiUser(user) };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        name: t.String(),
        role: t.Union([t.Literal("student"), t.Literal("teacher")]),
      }),
    },
  )
  .post("/logout", () => ({ success: true, message: "Logged out" }))
  .get("/me", ({ headers, set }) => {
    const user = getUserFromHeaders(headers);
    if (!user) {
      set.status = 401;
      return { success: false, message: "Not authenticated" };
    }
    return { success: true, user: toApiUser(user) };
  });

/* Admin routes */
export const adminRoutes = new Elysia({ prefix: "/admin" })
  .derive(({ headers, set }) => {
    const user = getUserFromHeaders(headers as any);
    if (!user || user.role !== "admin") {
      set.status = 403;
      return { adminUser: null as UserRow | null };
    }
    return { adminUser: user as UserRow | null };
  })
  .get("/users", ({ adminUser, set }) => {
    if (!adminUser) { set.status = 403; return { success: false, message: "Forbidden" }; }
    return {
      success: true,
      users: userStore.all().map((u) => ({
        id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.created_at,
      })),
    };
  })
  .patch(
    "/users/:id/role",
    async ({ params, body, adminUser, set }) => {
      if (!adminUser) { set.status = 403; return { success: false, message: "Forbidden" }; }
      const ok = await userStore.setRole(Number(params.id), body.role);
      if (!ok) { set.status = 404; return { success: false, message: "User not found" }; }
      return { success: true };
    },
    { body: t.Object({ role: t.Union([t.Literal("student"), t.Literal("teacher"), t.Literal("admin")]) }) },
  )
  .delete("/users/:id", async ({ params, adminUser, set }) => {
    if (!adminUser) { set.status = 403; return { success: false, message: "Forbidden" }; }
    const ok = await userStore.delete(Number(params.id));
    if (!ok) { set.status = 404; return { success: false, message: "User not found" }; }
    return { success: true };
  });
