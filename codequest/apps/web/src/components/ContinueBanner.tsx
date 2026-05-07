import { useNavigate } from "react-router-dom";
import { useProgressStore } from "../lib/progressStore";
import { findGame } from "../games/registry";

export default function ContinueBanner() {
  const navigate = useNavigate();
  const recentId = useProgressStore((s) => s.getMostRecentGameId());
  const progress = useProgressStore((s) => (recentId ? s.progress[recentId] : undefined));

  if (!recentId) return null;
  const game = findGame(recentId);
  if (!game || !progress) return null;

  return (
    <div
      className="rounded-[14px] p-4 flex items-center justify-between mb-6"
      style={{
        background: "var(--color-accent-bg)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center"
          style={{
            background: "var(--color-accent)",
            color: "white",
          }}
          aria-hidden="true"
        >
          <PlayIcon />
        </div>
        <div>
          <p
            className="text-[12px] mb-0.5"
            style={{ color: "var(--color-accent)" }}
          >
            Continue where you left off
          </p>
          <p
            className="text-[15px] font-medium"
            style={{ color: "var(--color-accent-text)" }}
          >
            {game.name} — Level {progress.highestLevel + 1}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate(`/play/${game.id}`)}
        className="px-4 py-2 text-[13px] font-medium rounded-[10px] transition-opacity hover:opacity-90"
        style={{
          background: "var(--color-accent)",
          color: "white",
        }}
      >
        Resume
      </button>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}
