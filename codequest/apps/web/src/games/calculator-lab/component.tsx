/**
 * CalculatorLab Component
 *
 * A visual calculator where students write JavaScript to implement calculator logic.
 * Students progress through levels of increasing complexity:
 *   L1: Display digits (basic variable assignment)
 *   L2: Addition (arithmetic + function composition)
 *   L3: Subtraction + Multiplication (switch/conditional logic)
 *   L4: Full flow (3 + 4 = 7, complete calculator)
 *   L5: Division by zero handling (error handling)
 *
 * Level completion requires passing predefined tests.
 * Code runs in a safe sandbox (TODO: migrate to Web Worker in #14).
 */

import React, { useEffect, useState } from "react";
import type { GameProps, MentorContext } from "@codequest/games-sdk";
import { LEVELS, runLevelTests } from "./levels";

export const CalculatorLabComponent: React.FC<GameProps> = ({
  level,
  onLevelComplete,
  onMentorRequest,
  onExit,
}) => {
  const [code, setCode] = useState<string>(LEVELS[level - 1]?.starterCode ?? "");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [passed, setPassed] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  useEffect(() => {
    const levelData = LEVELS[level - 1];
    if (levelData) {
      setCode(levelData.starterCode);
      setOutput("");
      setError("");
      setPassed(false);
      setAttempts(0);
      setHintsUsed(0);
      setStartTime(Date.now());
    }
  }, [level]);

  const currentLevel = LEVELS[level - 1];
  if (!currentLevel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Game Complete!</h1>
          <p className="text-lg text-slate-300 mb-8">
            You've completed all levels of Calculator Lab.
          </p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  const handleRun = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setError("");
    setOutput("");
    setPassed(false);

    const result = runLevelTests(level, code);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOutput(result.output);

    if (result.allTestsPassed) {
      setPassed(true);
      // Auto-complete on success
      setTimeout(() => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onLevelComplete({
          level,
          passed: true,
          timeSpent,
          attempts: newAttempts,
          artifact: code,
          hintsUsed,
        });
      }, 1200);
    }
  };

  const handleMentorRequest = () => {
    setHintsUsed((h) => h + 1);

    const context: MentorContext = {
      level,
      goal: currentLevel.goal,
      currentCode: code,
      errorMessage: error || undefined,
      extra: {
        levelTitle: currentLevel.title,
        testCases: currentLevel.testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
        })),
      },
    };

    onMentorRequest(context);
  };

  const handleNextLevel = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onLevelComplete({
      level,
      passed: true,
      timeSpent,
      attempts,
      artifact: code,
      hintsUsed,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/40 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {currentLevel.title}
            </h1>
            <p className="text-slate-400 mt-1">
              Level {level} of {LEVELS.length}
            </p>
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left: Editor Panel */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex-1 flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-2">
              Your Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your JavaScript here..."
              className="flex-1 bg-slate-950 text-white font-mono text-sm p-4 rounded border border-white/10 focus:border-blue-500 focus:outline-none resize-none"
              spellCheck="false"
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <label className="text-sm font-semibold text-slate-300 mb-2 block">
              Output
            </label>
            {error ? (
              <div className="bg-red-950/50 border border-red-500/30 text-red-200 p-3 rounded font-mono text-sm whitespace-pre-wrap break-words max-h-24 overflow-auto">
                {error}
              </div>
            ) : passed ? (
              <div className="bg-green-950/50 border border-green-500/30 text-green-200 p-3 rounded font-mono text-sm flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span className="font-bold">All tests passed!</span>
              </div>
            ) : output ? (
              <div className="bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded font-mono text-sm whitespace-pre-wrap break-words max-h-24 overflow-auto">
                {output}
              </div>
            ) : (
              <div className="text-slate-500 p-3 italic">
                Click "Run" to see output...
              </div>
            )}
          </div>
        </div>

        {/* Right: Instructions + Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Level Description */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">
              Goal
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {currentLevel.goal}
            </p>

            <h3 className="text-sm font-semibold text-slate-300 mb-2">
              Test Cases
            </h3>
            <div className="space-y-2">
              {currentLevel.testCases.map((tc, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-slate-700 rounded p-2 text-xs font-mono"
                >
                  <div className="text-slate-400">
                    Input: <span className="text-slate-200">{tc.input}</span>
                  </div>
                  <div className="text-slate-400">
                    Expected:{" "}
                    <span className="text-slate-200">{tc.expectedOutput}</span>
                  </div>
                </div>
              ))}
            </div>

            {currentLevel.hints && (
              <>
                <h3 className="text-sm font-semibold text-slate-300 mt-4 mb-2">
                  Hints
                </h3>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  {currentLevel.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Attempts</p>
                <p className="text-2xl font-bold text-white">{attempts}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Hints Used</p>
                <p className="text-2xl font-bold text-white">{hintsUsed}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRun}
              disabled={passed}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {passed ? "✓ Level Complete" : "▶ Run Code"}
            </button>

            <button
              onClick={handleMentorRequest}
              className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg transition-all duration-200"
            >
              💡 Ask Mentor
            </button>

            {passed && level < LEVELS.length && (
              <button
                onClick={handleNextLevel}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                → Next Level
              </button>
            )}
          </div>

          {/* Starter Code Help */}
          <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-2">
              <strong>Tip:</strong> Click "Run" to test your code.
            </p>
            <button
              onClick={() => setCode(currentLevel.starterCode)}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Reset to starter code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
