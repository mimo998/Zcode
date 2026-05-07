/**
 * HelloGame: The simplest possible game implementation.
 * Used to validate the SDK contract and game plumbing end-to-end.
 * Per Issue #4: ~30 lines that just show "press the button" and call onLevelComplete.
 */

import type { GameDefinition } from "@codequest/games-sdk";
import { HelloGameComponent } from "./component";

export const HelloGame: GameDefinition = {
  id: "hello-game",
  name: "Hello Game",
  tagline: "Learn the CodeQuest platform by pressing a button",
  icon: "ti-player-play",
  color: "teal",
  totalLevels: 1,
  Component: HelloGameComponent,
  // No unlockRequires — this is the starter game
  // No hardware requirements
};
