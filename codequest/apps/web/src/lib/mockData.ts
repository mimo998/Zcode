/**
 * Mock data for the lobby. Everything here will be replaced with API calls once
 * issues #2 (database), #3 (auth), and #7 (progress backend) land.
 *
 * Keep this file as the single source of mock truth — components import from it,
 * never hardcode their own fake data inline.
 */

export interface MockUser {
  id: string;
  displayName: string;
  initials: string;
  className: string;
  teacherName: string;
  streakDays: number;
  totalXp: number;
}

export interface MockProgress {
  /** key: gameId */
  [gameId: string]: {
    highestLevel: number;
    /** unix ms — used to surface "continue where you left off" */
    lastPlayedAt: number;
  };
}

export const mockUser: MockUser = {
  id: "user_demo",
  displayName: "Tamir",
  initials: "TS",
  className: "Period 4",
  teacherName: "Mr. Cohen",
  streakDays: 7,
  totalXp: 1240,
};

export const mockProgress: MockProgress = {
  "maze-runner": {
    highestLevel: 3,
    lastPlayedAt: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
  },
  "calculator-lab": {
    highestLevel: 2,
    lastPlayedAt: Date.now() - 1000 * 60 * 60 * 36, // 1.5 days ago
  },
};

export const mockMentorTip =
  "Last session you tried solving the maze with DFS and got stuck on cycles. Want a quick refresher on visited sets?";

export const mockLeaderboard = {
  rank: 4,
  xpBehindNext: 80,
  totalStudents: 28,
};
