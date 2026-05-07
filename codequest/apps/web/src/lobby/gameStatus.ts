import type { GameDefinition } from "@codequest/games-sdk";
import type { GameProgress } from "@codequest/shared";

export type GameStatus = "locked" | "new" | "in-progress" | "complete";

export function statusFor(
  game: GameDefinition,
  progressByGame: Record<string, GameProgress>,
): GameStatus {
  const gate = game.unlockRequires;
  if (gate) {
    const required = progressByGame[gate.gameId];
    if (!required || required.highestLevel < gate.minLevel) return "locked";
  }
  const own = progressByGame[game.id];
  if (!own || own.highestLevel <= 0) return "new";
  if (own.highestLevel >= game.totalLevels) return "complete";
  return "in-progress";
}

export function recentlyPlayed(
  progressByGame: Record<string, GameProgress>,
): GameProgress | undefined {
  const all = Object.values(progressByGame);
  if (all.length === 0) return undefined;
  return all.reduce((latest, p) =>
    new Date(p.lastPlayedAt) > new Date(latest.lastPlayedAt) ? p : latest,
  );
}
