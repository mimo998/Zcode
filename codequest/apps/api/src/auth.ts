import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key-change-this";
const SALT_ROUNDS = 10;

// דאטאבייס זמני
const users: Record<number, any> = {};
let userIdCounter = 1;

// JWT
function createJWT(userId: number, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Password
async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(plainPassword: string, hash: string) {
  return bcrypt.compare(plainPassword, hash);
}

// Routes
export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body;

      const user = Object.values(users).find((u) => u.email === email);

      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        set.status = 401;
        return { success: false, message: "Invalid email or password" };
      }

      const token = createJWT(user.id, user.role);
      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )

  .post(
    "/signup",
    async ({ body, set }) => {
      const { email, password, name, role } = body;

      if (Object.values(users).find((u) => u.email === email)) {
        set.status = 409;
        return { success: false, message: "Email already in use" };
      }

      const id = userIdCounter++;
      const passwordHash = await hashPassword(password);

      users[id] = {
        id,
        email,
        name,
        passwordHash,
        role,
        createdAt: new Date(),
      };

      const token = createJWT(id, role);
      return {
        success: true,
        token,
        user: { id, email, name, role },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        name: t.String(),
        role: t.Union([t.Literal("student"), t.Literal("teacher")]),
      }),
    }
  )

  .post("/logout", ({ set }) => {
    return { success: true, message: "Logged out" };
  })

  .get("/me", ({ headers, set }) => {
    const authHeader = headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      set.status = 401;
      return { success: false, message: "Not authenticated" };
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      set.status = 401;
      return { success: false, message: "Invalid token" };
    }

    const user = users[(decoded as any).userId];
    if (!user) {
      set.status = 404;
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  });