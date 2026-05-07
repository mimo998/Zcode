/**
 * HelloGame Component
 *
 * Minimal implementation: shows a button, tracks time, calls onLevelComplete.
 * Purpose: validate the SDK contract and game plumbing before building real games.
 */

import React, { useState } from "react";
import type { GameProps } from "@codequest/games-sdk";

export const HelloGameComponent: React.FC<GameProps> = ({
  level,
  onLevelComplete,
  onExit,
}) => {
  const [startTime] = useState<number>(Date.now());
  const [attempts, setAttempts] = useState<number>(0);

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onLevelComplete({
      level,
      passed: true,
      timeSpent,
      attempts: attempts + 1,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to CodeQuest!
        </h1>
        <p className="text-xl text-slate-300">
          Level {level} of {1}
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center max-w-md border border-white/20">
        <p className="text-lg text-white mb-6">
          This is the simplest game — just press the button to continue!
        </p>
        <p className="text-sm text-slate-300 mb-8">
          Attempts: <span className="font-mono font-bold">{attempts + 1}</span>
        </p>

        <button
          onClick={() => {
            setAttempts((a) => a + 1);
          }}
          className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors duration-200 mb-4"
        >
          Try ({attempts + 1})
        </button>

        <button
          onClick={handleComplete}
          className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          ✓ Complete Level
        </button>
      </div>

      <button
        onClick={onExit}
        className="mt-12 px-4 py-2 text-slate-400 hover:text-white transition-colors duration-200"
      >
        ← Back to Lobby
      </button>
    </div>
  );
};
