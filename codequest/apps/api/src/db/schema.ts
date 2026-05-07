import { integer, text, boolean, timestamp, pgTable, serial, varchar, json, pgEnum } from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  Unified users table with role-based access (NEW)                   */
/* ------------------------------------------------------------------ */

export const userRoleEnum = pgEnum("user_role", ["student", "teacher", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  // Optional teacher link for students
  teacherId: integer("teacher_id"),
  totalScore: integer("total_score").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Legacy tables — kept for migration compatibility. Plan: backfill   */
/*  these into `users` and drop in a follow-up migration.              */
/* ------------------------------------------------------------------ */

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  teacherId: integer("teacher_id").notNull().references(() => teachers.id),
  totalScore: integer("total_score").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => teachers.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: json("content").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const studentGameAccess = pgTable("student_game_access", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  gameId: integer("game_id").notNull().references(() => games.id),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
});

export const gameAttempts = pgTable("game_attempts", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  gameId: integer("game_id").notNull().references(() => games.id),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull(),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});
