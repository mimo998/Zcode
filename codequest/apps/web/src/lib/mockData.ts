/**
 * Mock data for the lobby. Everything here will be replaced with API calls once
 * issues #2 (database), #3 (auth), and #7 (progress backend) land.
 *
 * Keep this file as the single source of mock truth — components import from
 * it, never hardcode their own fake data inline.
 */
import type { GameProgress } from "@codequest/shared";

export interface CurrentStudent {
  id: string;
  displayName: string;
  initials: string;
  className: string;
  teacherName: string;
  streakDays: number;
  totalXp: number;
}

export const currentStudent: CurrentStudent = {
  id: "user_demo",
  displayName: "Tamir",
  initials: "TS",
  className: "Period 4 · Computer Science",
  teacherName: "Mr. Cohen",
  streakDays: 7,
  totalXp: 1240,
};

export const progressByGame: Record<string, GameProgress> = {
  "maze-runner": {
    userId: "user_demo",
    gameId: "maze-runner",
    highestLevel: 3,
    totalXp: 840,
    attempts: 14,
    lastPlayedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  "calculator-lab": {
    userId: "user_demo",
    gameId: "calculator-lab",
    highestLevel: 2,
    totalXp: 400,
    attempts: 7,
    lastPlayedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
};

export const mockMentorTip =
  "Last session you tried solving the maze with DFS and got stuck on cycles. " +
  "Want a quick refresher on visited sets?";

export const mockLeaderboard = {
  rank: 4,
  xpBehindNext: 80,
  totalStudents: 28,
};

// Aliases used by progressStore (alternative-ui compatibility)
export type MockUser = CurrentStudent;
export const mockUser = currentStudent;
export type MockProgress = typeof progressByGame;
export const mockProgress = progressByGame;
