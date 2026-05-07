import { Elysia, t } from "elysia";

// Temporary in-memory storage
const teachers: Record<number, any> = {};
const games: Record<number, any> = {};
const studentGameAccess: Record<number, any> = {};
let teacherIdCounter = 1;
let gameIdCounter = 1;

export const teacherRoutes = new Elysia({ prefix: "/teacher" })
  // Register Teacher
  .post(
    "/register",
    async ({ body, set }) => {
      const { email, name, password } = body;

      // Check if teacher exists
      const existingTeacher = Object.values(teachers).find((t: any) => t.email === email);
      if (existingTeacher) {
        set.status = 409;
        return { success: false, message: "Teacher already exists" };
      }

      const id = teacherIdCounter++;
      teachers[id] = {
        id,
        email,
        name,
        password,
        createdAt: new Date(),
      };

      return {
        success: true,
        teacher: { id: teachers[id].id, email: teachers[id].email, name: teachers[id].name },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        name: t.String(),
        password: t.String(),
      }),
    }
  )

  // Create Game
  .post(
    "/games",
    async ({ body, set }) => {
      const { title, description, content, teacherId } = body;
      const tId = Number(teacherId);

      // Verify teacher exists
      if (!teachers[tId]) {
        set.status = 404;
        return { success: false, message: "Teacher not found" };
      }

      const id = gameIdCounter++;
      games[id] = {
        id,
        teacherId: tId,
        title,
        description,
        content: typeof content === "string" ? JSON.parse(content) : content,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        success: true,
        game: {
          id: games[id].id,
          title: games[id].title,
          description: games[id].description,
          createdAt: games[id].createdAt,
        },
      };
    },
    {
      body: t.Object({
        teacherId: t.Number(),
        title: t.String(),
        description: t.String(),
        content: t.Any(),
      }),
    }
  )

  // Get Teacher's Games
  .get("/games/:teacherId", async ({ params, set }) => {
    const teacherId = Number(params.teacherId);

    if (!teachers[teacherId]) {
      set.status = 404;
      return { success: false, message: "Teacher not found" };
    }

    const teacherGames = Object.values(games).filter((g: any) => g.teacherId === teacherId);

    return {
      success: true,
      games: teacherGames.map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        studentCount: Object.values(studentGameAccess).filter((a: any) => a.gameId === g.id).length,
        createdAt: g.createdAt,
      })),
    };
  })

  // Get Teacher's Students
  .get("/students/:teacherId", async ({ params, set }) => {
    const teacherId = Number(params.teacherId);

    if (!teachers[teacherId]) {
      set.status = 404;
      return { success: false, message: "Teacher not found" };
    }

    const students = [
      { id: 1, name: "Ahmed", email: "ahmed@example.com", totalScore: 450, gamesCompleted: 3 },
      { id: 2, name: "Sara", email: "sara@example.com", totalScore: 520, gamesCompleted: 4 },
      { id: 3, name: "Omar", email: "omar@example.com", totalScore: 380, gamesCompleted: 2 },
    ];

    return {
      success: true,
      students,
    };
  })

  // Assign Game to Students
  .post(
    "/games/:gameId/assign",
    async ({ body, params, set }) => {
      const gameId = Number(params.gameId);
      const { studentIds } = body;

      if (!games[gameId]) {
        set.status = 404;
        return { success: false, message: "Game not found" };
      }

      let accessIdCounter = Object.keys(studentGameAccess).length + 1;
      studentIds.forEach((studentId: number) => {
        studentGameAccess[accessIdCounter] = {
          id: accessIdCounter,
          studentId,
          gameId,
          assignedAt: new Date(),
        };
        accessIdCounter++;
      });

      return {
        success: true,
        message: `Game assigned to ${studentIds.length} students`,
      };
    },
    {
      body: t.Object({
        studentIds: t.Array(t.Number()),
      }),
    }
  )

  // Update Game
  .put(
    "/games/:gameId",
    async ({ body, params, set }) => {
      const gameId = Number(params.gameId);
      const { title, description, content } = body;

      if (!games[gameId]) {
        set.status = 404;
        return { success: false, message: "Game not found" };
      }

      games[gameId] = {
        ...games[gameId],
        title: title || games[gameId].title,
        description: description || games[gameId].description,
        content: content ? (typeof content === "string" ? JSON.parse(content) : content) : games[gameId].content,
        updatedAt: new Date(),
      };

      return {
        success: true,
        game: games[gameId],
      };
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        content: t.Optional(t.Any()),
      }),
    }
  )

  // Delete Game
  .delete("/games/:gameId", async ({ params, set }) => {
    const gameId = Number(params.gameId);

    if (!games[gameId]) {
      set.status = 404;
      return { success: false, message: "Game not found" };
    }

    delete games[gameId];

    return {
      success: true,
      message: "Game deleted",
    };
  });