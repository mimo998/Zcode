/**
 * Minimal "games-sdk" shim.
 *
 * Games like CodeBreaker were written against an SDK contract from another branch.
 * Rather than rewriting them, we define the same types here so they can be dropped
 * in as-is. They import `@codequest/games-sdk` — see vite.config.ts alias.
 *
 * Keep this in sync if you import more games from elsewhere.
 */

import type { ComponentType } from "react";

/** Result a game reports when a level finishes. */
export interface LevelResult {
  level: number;
  passed: boolean;
  timeSpent: number;     // seconds
  attempts: number;
  /** Free-form artifact the game wants to store (e.g. final code). Optional. */
  artifact?: string;
  /** How many in-game hints were revealed for this level. */
  hintsUsed?: number;
}

/** Context a game passes when the student requests a mentor hint. */
export interface MentorRequest {
  level: number;
  goal: string;            // what concept the level is teaching
  currentCode?: string;    // student's current attempt
  errorMessage?: string;   // last test failure / runtime error
}

/** Props every game component receives. */
export interface GameProps {
  level: number;
  onLevelComplete: (result: LevelResult) => void;
  onMentorRequest: (req: MentorRequest) => void;
  onExit: () => void;
}

/** Game registration metadata. */
export interface GameDefinition {
  id: string;
  name: string;
  tagline: string;
  icon: string;            // tabler icon name, e.g. "ti-diamond" — display only
  color: string;           // tailwind color hint, e.g. "purple"
  totalLevels: number;
  Component: ComponentType<GameProps>;
  unlockRequires?: string[];
  hardware?: unknown;
}
