import type { GameDefinition } from "@codequest/games-sdk";
import { HelloGame } from "./hello-game/definition";
import { CalculatorLab } from "./calculator-lab/definition";

/**
 * The registry of all minigames available in the lobby.
 *
 * To add a new game:
 *   1. Build it as a React component implementing the GameProps interface from @codequest/games-sdk
 *   2. Export a GameDefinition for it (see games-sdk for the shape)
 *   3. Import + add it to this array
 *
 * The lobby reads this registry directly. No other UI code needs to change to add a game.
 */
export const games: GameDefinition[] = [
  HelloGame,
  CalculatorLab,
];

export function findGame(id: string): GameDefinition | undefined {
  return games.find((g) => g.id === id);
}
