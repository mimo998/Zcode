/**
 * EXAMPLE INTEGRATION CODE
 *
 * This file shows how to wire up the games registry into your lobby and game runtime.
 * Copy and adapt these patterns into your existing components.
 */

// ============================================================================
// EXAMPLE 1: Lobby Component (renders game cards)
// ============================================================================
// File: apps/web/src/pages/Lobby.tsx (example location)

import React from "react";
import { useNavigate } from "react-router-dom";
import { GAMES, canPlayGame } from "../games/registry";

interface StudentProgress {
  [gameId: string]: number; // gameId -> current level
}

export const Lobby: React.FC = () => {
  const navigate = useNavigate();
  // TODO: Load from /api/me/progress
  const studentProgress: StudentProgress = {};

  const handlePlayGame = (gameId: string) => {
    navigate(`/play/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Lobby</h1>
          <p className="text-slate-400">Pick a game and start learning</p>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => {
            const playerCanPlay = canPlayGame(game.id, studentProgress);
            const currentLevel = studentProgress[game.id] ?? 0;
            const progress = (currentLevel / game.totalLevels) * 100;

            return (
              <div
                key={game.id}
                className={`
                  relative p-6 rounded-lg border transition-all cursor-pointer
                  ${
                    playerCanPlay
                      ? "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                      : "bg-slate-900/50 border-slate-700 opacity-60 cursor-not-allowed"
                  }
                `}
                onClick={() => {
                  if (playerCanPlay) handlePlayGame(game.id);
                }}
              >
                {/* Game Icon + Color Accent */}
                <div
                  className={`
                    w-16 h-16 rounded-lg mb-4 flex items-center justify-center
                    text-2xl font-bold
                    ${
                      game.color === "teal"
                        ? "bg-teal-500/20 text-teal-300"
                        : game.color === "blue"
                          ? "bg-blue-500/20 text-blue-300"
                          : game.color === "amber"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-500/20 text-slate-300"
                    }
                  `}
                >
                  {/* Icon: use tabler icon or emoji as fallback */}
                  {game.icon === "ti-player-play" && "▶"}
                  {game.icon === "ti-calculator" && "🧮"}
                </div>

                {/* Title + Tagline */}
                <h3 className="text-xl font-bold text-white mb-1">
                  {game.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4">{game.tagline}</p>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">
                      Level {currentLevel} / {game.totalLevels}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        game.color === "teal"
                          ? "bg-teal-500"
                          : game.color === "blue"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Locked Indicator */}
                {!playerCanPlay && (
                  <div className="mt-4 p-3 bg-slate-800 rounded text-xs text-slate-400">
                    <p>
                      Unlock by completing{" "}
                      {game.unlockRequires?.gameId || "another game"}
                    </p>
                  </div>
                )}

                {/* Play Button */}
                {playerCanPlay && (
                  <button className="mt-4 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors">
                    {currentLevel === 0 ? "Start" : "Continue"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Game Runtime Route (mounts the actual game)
// ============================================================================
// File: apps/web/src/pages/GamePlay.tsx (example location)

import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameById } from "../games/registry";
import type { LevelResult, MentorContext } from "@codequest/games-sdk";

export const GamePlay: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  // TODO: Load from /api/me/progress
  const [currentLevel, setCurrentLevel] = useState(1);
  const [mentorVisible, setMentorVisible] = useState(false);
  const [mentorContext, setMentorContext] = useState<MentorContext | null>(
    null
  );

  const game = gameId ? getGameById(gameId) : null;

  if (!gameId || !game) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Game Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  const handleLevelComplete = useCallback(
    async (result: LevelResult) => {
      // POST to backend to save progress
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: game.id,
            ...result,
          }),
        });

        if (!response.ok) throw new Error("Failed to save progress");

        // If there are more levels, move to next
        if (result.level < game.totalLevels) {
          setCurrentLevel(result.level + 1);
        } else {
          // Game complete, return to lobby
          navigate("/");
        }
      } catch (err) {
        console.error("Error saving progress:", err);
        // TODO: Show error toast
      }
    },
    [game, navigate]
  );

  const handleMentorRequest = useCallback((context: MentorContext) => {
    // Show mentor sidebar with context
    setMentorContext(context);
    setMentorVisible(true);

    // TODO: Send to /api/mentor/message for AI response
  }, []);

  const handleExit = useCallback(() => {
    // Return to lobby
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Main Game Area */}
      <div className="flex-1">
        <game.Component
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          onMentorRequest={handleMentorRequest}
          onExit={handleExit}
        />
      </div>

      {/* Mentor Sidebar (from Issue #9) */}
      {mentorVisible && mentorContext && (
        <div className="w-96 bg-slate-800 border-l border-white/10 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Mentor Help</h3>
            <button
              onClick={() => setMentorVisible(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* TODO: Wire up to /api/mentor/message */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-2">Your Goal:</p>
              <p className="text-white bg-slate-900 p-3 rounded">
                {mentorContext.goal}
              </p>
            </div>

            {mentorContext.currentCode && (
              <div>
                <p className="text-sm text-slate-400 mb-2">Your Code:</p>
                <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded overflow-auto max-h-32">
                  {mentorContext.currentCode}
                </pre>
              </div>
            )}

            {mentorContext.errorMessage && (
              <div>
                <p className="text-sm text-slate-400 mb-2">Error:</p>
                <p className="text-red-300 bg-red-950/50 p-3 rounded text-xs">
                  {mentorContext.errorMessage}
                </p>
              </div>
            )}

            <div className="mt-6 p-4 bg-slate-900 rounded border border-slate-700">
              <p className="text-sm text-amber-300">
                💡 Mentor thinking... (TODO: stream response from /api/mentor/message)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Router Setup
// ============================================================================
// File: apps/web/src/Router.tsx (example location)

import { createBrowserRouter } from "react-router-dom";
import { Lobby } from "./pages/Lobby";
import { GamePlay } from "./pages/GamePlay";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Lobby />,
  },
  {
    path: "/play/:gameId",
    element: <GamePlay />,
  },
  // ... other routes
]);

// ============================================================================
// EXAMPLE 4: Using canPlayGame() for unlock logic
// ============================================================================

import { canPlayGame } from "./games/registry";

function checkIfStudentCanPlayCalculatorLab(
  studentProgress: Record<string, number>
) {
  // If CalculatorLab requires HelloGame to be completed first
  const canPlay = canPlayGame("calculator-lab", studentProgress);
  return canPlay; // true/false
}

// ============================================================================
// EXAMPLE 5: API Integration (Future)
// ============================================================================

// TODO: In GamePlay component, integrate with these endpoints:

// Get student's progress
async function getStudentProgress() {
  const res = await fetch("/api/me/progress");
  // Returns: { [gameId]: currentLevel }
}

// Save level completion
async function saveLevelCompletion(
  gameId: string,
  level: number,
  passed: boolean,
  artifact?: string
) {
  const res = await fetch("/api/attempts", {
    method: "POST",
    body: JSON.stringify({
      gameId,
      level,
      passed,
      artifact,
      // ... other fields from LevelResult
    }),
  });
}

// Request mentor help
async function requestMentorHelp(context: MentorContext) {
  const res = await fetch("/api/mentor/message", {
    method: "POST",
    body: JSON.stringify(context),
  });
  // Streams response (SSE or WebSocket)
}

// ============================================================================
// SUMMARY
// ============================================================================

/*
Key integration points:

1. LOBBY:
   - Import { GAMES, canPlayGame } from './games/registry'
   - Render GAMES.map(game => <GameCard />)
   - Use canPlayGame() to show lock status

2. GAME RUNTIME:
   - Import { getGameById } from './games/registry'
   - Mount: <game.Component level={level} {...callbacks} />
   - Implement callbacks (onLevelComplete, onMentorRequest, onExit)

3. API CALLS:
   - onLevelComplete → POST /api/attempts
   - onMentorRequest → POST /api/mentor/message (Issue #9)
   - Sidebar rendering (Issue #9)

4. STATE MANAGEMENT:
   - Current level (from DB or local state)
   - Student progress (from /api/me/progress)
   - Mentor visibility + context

This is the minimal integration. Adapt to your architecture!
*/
