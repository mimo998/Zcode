import type { ComponentType } from "react";

/**
 * Every minigame in CodeQuest implements this interface.
 *
 * The lobby reads the registry of GameDefinitions to render cards, route to games,
 * and track progress — without knowing anything about a game's internals.
 *
 * To add a new game later: implement GameDefinition, register it in
 * apps/web/src/games/registry.ts, and the lobby picks it up automatically.
 */
export interface GameDefinition {
  /** Stable kebab-case id, used in URLs and DB. Never change this once shipped. */
  id: string;

  /** Display name shown in the lobby card. */
  name: string;

  /** One-sentence pitch for the lobby card. */
  tagline: string;

  /** Tabler icon name, e.g. "ti-route". */
  icon: string;

  /** Color ramp key for the card accent. */
  color: "teal" | "blue" | "amber" | "pink" | "purple" | "coral";

  /** Total levels in this game. Used for progress bars. */
  totalLevels: number;

  /** Optional gating: this game unlocks only after the listed game reaches this level. */
  unlockRequires?: { gameId: string; minLevel: number };

  /** The actual game React component. Receives standard props (see GameProps). */
  Component: ComponentType<GameProps>;

  /**
   * Hardware/runtime requirements. The lobby uses these to surface compatibility warnings
   * (e.g. "this game needs WebSerial — try Chrome").
   */
  requires?: Array<"webserial" | "webgl" | "pyodide">;
}

/**
 * Props every game receives from the platform.
 * Games use these to report progress and request mentor help — they don't talk to the
 * backend directly. Keeps games portable and testable in isolation.
 */
export interface GameProps {
  /** The level the student is starting on. */
  level: number;

  /** Called by the game when the student completes a level successfully. */
  onLevelComplete: (result: LevelResult) => void;

  /**
   * Called by the game when the student needs a mentor hint. The platform decides
   * how to render the mentor (sidebar, modal, etc.) — the game just signals "help needed".
   */
  onMentorRequest: (context: MentorContext) => void;

  /** Called when the student exits back to the lobby. */
  onExit: () => void;
}

export interface LevelResult {
  level: number;
  /** Did the student solve it? */
  passed: boolean;
  /** Time spent in seconds. */
  timeSpent: number;
  /** Number of attempts before passing. */
  attempts: number;
  /** Optional: the student's final code/solution, for the teacher dashboard + mentor context. */
  artifact?: string;
  /** Optional: how many times they asked the mentor. */
  hintsUsed?: number;
}

/**
 * Context the game gives the mentor when the student asks for help.
 * The mentor uses this to give targeted guidance instead of generic answers.
 */
export interface MentorContext {
  level: number;
  /** What the student is currently looking at / trying to do. */
  goal: string;
  /** The student's current code or attempt. */
  currentCode?: string;
  /** Any error message they're seeing. */
  errorMessage?: string;
  /** Free-form: the game can pass anything else the mentor should know. */
  extra?: Record<string, unknown>;
}
