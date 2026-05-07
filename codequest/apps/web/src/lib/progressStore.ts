/**
 * Progress store. Components never read mockData directly — they go through this store.
 *
 * When the real API lands (issue #7), only this file changes:
 * - add a useEffect that calls /api/me/progress on mount
 * - replace the mock initialization with the API response
 *
 * Components stay the same.
 */
import { create } from "zustand";
import { mockUser, mockProgress, type MockUser, type MockProgress } from "./mockData";

interface ProgressState {
  user: MockUser;
  progress: MockProgress;

  /** True when initial data is loaded. Always true with mocks; matters once we go live. */
  ready: boolean;

  /** Get progress for a single game, or undefined if never played. */
  getGameProgress: (gameId: string) => MockProgress[string] | undefined;

  /** Find the most-recently-played game, used by the "Continue" banner. */
  getMostRecentGameId: () => string | undefined;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  user: mockUser,
  progress: mockProgress,
  ready: true,

  getGameProgress: (gameId) => get().progress[gameId],

  getMostRecentGameId: () => {
    const entries = Object.entries(get().progress);
    if (entries.length === 0) return undefined;
    entries.sort(
      (a, b) =>
        new Date(b[1].lastPlayedAt).getTime() -
        new Date(a[1].lastPlayedAt).getTime(),
    );
    return entries[0]?.[0];
  },
}));

/** Convenience hook — most components only need user + helpers, not the whole state. */
export function useUser() {
  return useProgressStore((s) => s.user);
}
