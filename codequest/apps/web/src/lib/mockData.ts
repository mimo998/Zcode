/**
 * Stub data for the lobby until #3 (auth) and #7 (progress backend) land.
 * The shape mirrors the real types in @codequest/shared so the swap is mechanical.
 */
import type { GameProgress } from "@codequest/shared";

export interface CurrentStudent {
  displayName: string;
  initials: string;
  className: string;
  totalXp: number;
  streakDays: number;
}

export const currentStudent: CurrentStudent = {
  displayName: "Ada Lovelace",
  initials: "AL",
  className: "10-B Computer Science",
  totalXp: 0,
  streakDays: 0,
};

export const progressByGame: Record<string, GameProgress> = {};
