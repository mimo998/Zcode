import { useNavigate } from "react-router-dom";
import type { GameDefinition } from "@codequest/games-sdk";
import { findGame, isGameUnlocked } from "../games/registry";
import { useProgressStore } from "../lib/progressStore";

interface GameCardProps {
  game: GameDefinition;
}

export default function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress[game.id]);
  const allProgress = useProgressStore((s) => s.progress);

  const unlocked = isGameUnlocked(game, allProgress);
  const highestLevel = progress?.highestLevel ?? 0;
  const completed = highestLevel >= game.totalLevels;
  const inProgress = unlocked && highestLevel > 0 && !completed;
  const isNew = unlocked && highestLevel === 0;

  const handleClick = () => {
    if (!unlocked) return;
    navigate(`/play/${game.id}`);
  };

  const accent = colorTokens(game.color);
  const progressPct =
    game.totalLevels > 0 ? Math.round((highestLevel / game.totalLevels) * 100) : 0;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!unlocked}
      className="text-left p-4 rounded-[14px] transition-colors w-full"
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
        cursor: unlocked ? "pointer" : "not-allowed",
        opacity: unlocked ? 1 : 0.7,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-[10px] flex items-center justify-center"
          style={{
            background: accent.bg,
            color: accent.text,
          }}
          aria-hidden="true"
        >
          <GameIcon name={game.icon} />
        </div>
        <StatusBadge
          state={
            !unlocked
              ? "locked"
              : completed
                ? "complete"
                : inProgress
                  ? "in-progress"
                  : "new"
          }
        />
      </div>

      <p className="text-[15px] font-medium mb-1">{game.name}</p>
      <p
        className="text-[13px] mb-3 leading-snug"
        style={{ color: "var(--color-text-muted)" }}
      >
        {game.tagline}
      </p>

      {!unlocked && <UnlockHint game={game} />}

      {unlocked && inProgress && (
        <ProgressRow
          highestLevel={highestLevel}
          totalLevels={game.totalLevels}
          pct={progressPct}
          color={accent.barColor}
        />
      )}

      {unlocked && isNew && <NewHint />}

      {unlocked && completed && (
        <p className="text-[12px]" style={{ color: "var(--color-success)" }}>
          Completed — replay any level
        </p>
      )}
    </button>
  );
}

/* ----- Sub-components ----- */

function ProgressRow({
  highestLevel,
  totalLevels,
  pct,
  color,
}: {
  highestLevel: number;
  totalLevels: number;
  pct: number;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-2 text-[12px]"
      style={{ color: "var(--color-text-muted)" }}
    >
      <span className="nums">
        Level {highestLevel} / {totalLevels}
      </span>
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: "var(--color-surface-muted)" }}
      >
        <div
          className="h-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="nums">{pct}%</span>
    </div>
  );
}

function NewHint() {
  return (
    <div
      className="flex items-center gap-1.5 text-[12px]"
      style={{ color: "var(--color-text-muted)" }}
    >
      <SparklesIcon />
      <span>Just released — try it out</span>
    </div>
  );
}

function UnlockHint({ game }: { game: GameDefinition }) {
  if (!game.unlockRequires) return null;
  const required = findGame(game.unlockRequires.gameId);
  if (!required) return null;
  return (
    <div
      className="flex items-center gap-1.5 text-[12px]"
      style={{ color: "var(--color-text-subtle)" }}
    >
      <LockIcon />
      <span>
        Reach level {game.unlockRequires.minLevel} in {required.name} to unlock
      </span>
    </div>
  );
}

function StatusBadge({
  state,
}: {
  state: "locked" | "new" | "in-progress" | "complete";
}) {
  const styles: Record<typeof state, { bg: string; text: string; label: string }> = {
    locked: {
      bg: "var(--color-surface-muted)",
      text: "var(--color-text-muted)",
      label: "Locked",
    },
    new: {
      bg: "var(--color-pink-bg)",
      text: "var(--color-pink-text)",
      label: "New",
    },
    "in-progress": {
      bg: "var(--color-success-bg)",
      text: "var(--color-success-text)",
      label: "In progress",
    },
    complete: {
      bg: "var(--color-info-bg)",
      text: "var(--color-info-text)",
      label: "Complete",
    },
  };
  const s = styles[state];
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

/* ----- Color tokens per game color ----- */

function colorTokens(color: GameDefinition["color"]) {
  switch (color) {
    case "teal":
      return {
        bg: "var(--color-success-bg)",
        text: "var(--color-success-text)",
        barColor: "var(--color-success)",
      };
    case "blue":
      return {
        bg: "var(--color-info-bg)",
        text: "var(--color-info-text)",
        barColor: "var(--color-info)",
      };
    case "amber":
      return {
        bg: "var(--color-warning-bg)",
        text: "var(--color-warning-text)",
        barColor: "var(--color-warning)",
      };
    case "pink":
      return {
        bg: "var(--color-pink-bg)",
        text: "var(--color-pink-text)",
        barColor: "var(--color-pink)",
      };
    case "purple":
    case "coral":
    default:
      return {
        bg: "var(--color-accent-bg)",
        text: "var(--color-accent-text)",
        barColor: "var(--color-accent)",
      };
  }
}

/* ----- Icons (inline SVG for one less dependency) ----- */

function GameIcon({ name }: { name: string }) {
  switch (name) {
    case "route":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="5" r="3" />
          <path d="M6.7 17.3 17.3 6.7" strokeDasharray="2 2" />
        </svg>
      );
    case "calculator":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="12" x2="8" y2="12" />
          <line x1="12" y1="12" x2="12" y2="12" />
          <line x1="16" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="12" y1="16" x2="12" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      );
    case "cpu":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="2" x2="9" y2="4" />
          <line x1="15" y1="2" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="22" />
          <line x1="15" y1="20" x2="15" y2="22" />
          <line x1="20" y1="9" x2="22" y2="9" />
          <line x1="20" y1="15" x2="22" y2="15" />
          <line x1="2" y1="9" x2="4" y2="9" />
          <line x1="2" y1="15" x2="4" y2="15" />
        </svg>
      );
    case "cube":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    default:
      return null;
  }
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-pink)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}
