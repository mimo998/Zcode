import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findGame } from "../games/registry";
import type { LevelResult, MentorContext } from "@codequest/games-sdk";

export default function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const game = gameId ? findGame(gameId) : undefined;

  const [currentLevel, setCurrentLevel] = useState(1);
  const [mentorContext, setMentorContext] = useState<MentorContext | null>(null);

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Game "{gameId}" not found.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            ← Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  const handleLevelComplete = (result: LevelResult) => {
    if (result.level >= game.totalLevels) {
      navigate("/");
    } else {
      setCurrentLevel((l) => l + 1);
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  const handleMentorRequest = (context: MentorContext) => {
    setMentorContext(context);
  };

  const GameComponent = game.Component;

  return (
    <div className="relative">
      <GameComponent
        level={currentLevel}
        onLevelComplete={handleLevelComplete}
        onExit={handleExit}
        onMentorRequest={handleMentorRequest}
      />

      {/* Mentor Panel */}
      {mentorContext && (
        <div className="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-white/10 flex flex-col z-50 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h2 className="font-semibold text-white text-sm">💡 Mentor</h2>
            <button
              onClick={() => setMentorContext(null)}
              className="text-slate-400 hover:text-white text-lg leading-none"
              aria-label="Close mentor panel"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold mb-1">
                Goal
              </p>
              <p className="text-slate-200">{mentorContext.goal}</p>
            </div>

            {mentorContext.errorMessage && (
              <div>
                <p className="text-slate-400 text-xs uppercase font-semibold mb-1">
                  Error
                </p>
                <pre className="text-red-300 font-mono text-xs bg-red-950/40 border border-red-500/20 rounded p-2 whitespace-pre-wrap break-words">
                  {mentorContext.errorMessage}
                </pre>
              </div>
            )}

            {mentorContext.currentCode && (
              <div>
                <p className="text-slate-400 text-xs uppercase font-semibold mb-1">
                  Your Code
                </p>
                <pre className="text-slate-300 font-mono text-xs bg-slate-800 border border-white/10 rounded p-2 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                  {mentorContext.currentCode}
                </pre>
              </div>
            )}

            <div className="bg-amber-950/40 border border-amber-500/20 rounded p-3">
              <p className="text-amber-300 text-xs font-semibold mb-1">
                Mentor hints
              </p>
              <p className="text-amber-200/80 text-xs">
                Re-read the goal carefully. Check that your function name
                matches exactly, and that you're returning a value (not just
                printing it). Try "Reset to starter code" if you're stuck.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
