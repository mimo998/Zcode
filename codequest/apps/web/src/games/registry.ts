import type { GameDefinition } from "@codequest/games-sdk";
import PlaceholderGame from "./placeholders/PlaceholderGame";

/**
 * Registry of all minigames. The lobby reads from this; nothing else needs to know
 * about specific games.
 *
 * To add or replace a game:
 *   1. Build a React component implementing GameProps (see @codequest/games-sdk)
 *   2. Replace the `Component` field below (or append a new GameDefinition)
 *   3. Done — the lobby picks it up automatically
 *
 * All four games currently point at PlaceholderGame. Each will be replaced in its
 * own issue:
 *   - maze-runner    → issue #13
 *   - calculator-lab → issue #TBD
 *   - arduino-workshop → issue #TBD
 *   - print-studio   → issue #TBD
 */
export const games: GameDefinition[] = [
  {
    id: "maze-runner",
    name: "Maze Runner",
    tagline: "Pathfinding algorithms, visualised step by step.",
    icon: "route",
    color: "teal",
    totalLevels: 8,
    Component: PlaceholderGame,
  },
  {
    id: "calculator-lab",
    name: "Calculator Lab",
    tagline: "Build the math functions behind a real calculator UI.",
    icon: "calculator",
    color: "blue",
    totalLevels: 6,
    Component: PlaceholderGame,
  },
  {
    id: "arduino-workshop",
    name: "Arduino Workshop",
    tagline: "Plug in a board and make LEDs and motors come alive.",
    icon: "cpu",
    color: "amber",
    totalLevels: 5,
    unlockRequires: { gameId: "maze-runner", minLevel: 4 },
    requires: ["webserial"],
    Component: PlaceholderGame,
  },
  {
    id: "print-studio",
    name: "3D Print Studio",
    tagline: "Code 3D shapes with JSCAD. Best ones get printed.",
    icon: "cube",
    color: "pink",
    totalLevels: 4,
    Component: PlaceholderGame,
  },
];

export function findGame(id: string): GameDefinition | undefined {
  return games.find((g) => g.id === id);
}

/**
 * Returns the unlock state of a game given the user's current progress across all games.
 * Centralized here (not in the lobby) so games can also check it if needed.
 */
export function isGameUnlocked(
  game: GameDefinition,
  progressByGameId: Record<string, { highestLevel: number }>,
): boolean {
  if (!game.unlockRequires) return true;
  const req = progressByGameId[game.unlockRequires.gameId];
  return (req?.highestLevel ?? 0) >= game.unlockRequires.minLevel;
}
