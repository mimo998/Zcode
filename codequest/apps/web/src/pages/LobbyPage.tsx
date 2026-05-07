import React from "react";
import { useNavigate } from "react-router-dom";
import { games } from "../games/registry";
import type { GameDefinition } from "@codequest/games-sdk";

type ColorStyle = { accent: string; border: string; badge: string; glow: string };

const defaultColor: ColorStyle = {
  accent: "text-blue-400",
  border: "border-blue-500/30 hover:border-blue-400/60",
  badge: "bg-blue-500/20 text-blue-300",
  glow: "hover:shadow-blue-500/10",
};

const colorMap: Record<string, ColorStyle> = {
  teal: {
    accent: "text-teal-400",
    border: "border-teal-500/30 hover:border-teal-400/60",
    badge: "bg-teal-500/20 text-teal-300",
    glow: "hover:shadow-teal-500/10",
  },
  blue: defaultColor,
  amber: {
    accent: "text-amber-400",
    border: "border-amber-500/30 hover:border-amber-400/60",
    badge: "bg-amber-500/20 text-amber-300",
    glow: "hover:shadow-amber-500/10",
  },
  pink: {
    accent: "text-pink-400",
    border: "border-pink-500/30 hover:border-pink-400/60",
    badge: "bg-pink-500/20 text-pink-300",
    glow: "hover:shadow-pink-500/10",
  },
  purple: {
    accent: "text-purple-400",
    border: "border-purple-500/30 hover:border-purple-400/60",
    badge: "bg-purple-500/20 text-purple-300",
    glow: "hover:shadow-purple-500/10",
  },
  coral: {
    accent: "text-orange-400",
    border: "border-orange-500/30 hover:border-orange-400/60",
    badge: "bg-orange-500/20 text-orange-300",
    glow: "hover:shadow-orange-500/10",
  },
};

function GameCard({ game }: { game: GameDefinition }) {
  const navigate = useNavigate();
  const colors: ColorStyle = colorMap[game.color] ?? defaultColor;

  return (
    <button
      onClick={() => navigate(`/play/${game.id}`)}
      className={`group w-full text-left bg-white/5 border ${colors.border} rounded-2xl p-6 transition-all duration-200 hover:bg-white/8 hover:shadow-xl ${colors.glow} cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`text-3xl ${colors.accent} font-mono select-none`}
          aria-hidden="true"
        >
          {"{ }"}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.badge}`}>
          {game.totalLevels} {game.totalLevels === 1 ? "level" : "levels"}
        </span>
      </div>

      <h2 className="text-lg font-bold text-white mb-1 group-hover:text-white/90">
        {game.name}
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed">{game.tagline}</p>

      <div className={`mt-4 text-xs font-semibold ${colors.accent} flex items-center gap-1`}>
        Play now
        <span className="group-hover:translate-x-1 transition-transform duration-150">→</span>
      </div>
    </button>
  );
}

export default function LobbyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
            CQ
          </div>
          <span className="text-lg font-semibold">CodeQuest</span>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Choose Your Game
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Learn to code by building real things. Pick a game and start playing.
        </p>
      </div>

      {/* Game Grid */}
      <main className="max-w-5xl mx-auto px-6 pb-20">
        {games.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            No games available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
