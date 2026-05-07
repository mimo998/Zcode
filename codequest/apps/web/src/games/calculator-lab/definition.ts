/**
 * CalculatorLab: A visual calculator where students write JavaScript step-by-step.
 * Teaches: variables, functions, control flow, error handling.
 */

import type { GameDefinition } from "@codequest/games-sdk";
import { CalculatorLabComponent } from "./component";

export const CalculatorLab: GameDefinition = {
  id: "calculator-lab",
  name: "Calculator Lab",
  tagline: "Build a calculator by writing JavaScript logic",
  icon: "ti-calculator",
  color: "blue",
  totalLevels: 5,
  Component: CalculatorLabComponent,
  // Unlock after HelloGame completes (or leave empty if we want this available immediately)
  // unlockRequires: { gameId: "hello-game", minLevel: 1 },
  requires: [], // No special hardware needed
};
