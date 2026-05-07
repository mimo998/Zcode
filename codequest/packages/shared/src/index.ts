/**
 * API contract types shared by the web app and the API server.
 * Keeping these in one place means breaking changes are a TS error, not a runtime bug.
 */

export type Role = "student" | "teacher";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  teacherId: string;
  joinCode: string;
}

export interface GameProgress {
  userId: string;
  gameId: string;
  highestLevel: number;
  totalXp: number;
  attempts: number;
  lastPlayedAt: string;
}

export interface LevelAttempt {
  id: string;
  userId: string;
  gameId: string;
  level: number;
  passed: boolean;
  timeSpent: number;
  hintsUsed: number;
  artifact?: string;
  createdAt: string;
}

/** What the teacher dashboard pulls per student. */
export interface StudentSummary {
  user: User;
  totalXp: number;
  streakDays: number;
  games: Array<{
    gameId: string;
    highestLevel: number;
    progress: number;
  }>;
  /** AI-generated summary of strengths, gaps, and engagement. */
  aiSummary?: string;
}

export interface MentorMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
