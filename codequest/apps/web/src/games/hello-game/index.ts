import type { GameDefinition } from "@codequest/games-sdk";
import { HelloGame } from "./HelloGame";

export const helloGame: GameDefinition = {
  id: "hello-game",
  name: "HelloGame",
  tagline: "A tiny first step — press a button, finish a level.",
  icon: "ti-sparkles",
  color: "teal",
  totalLevels: 1,
  Component: HelloGame,
};
