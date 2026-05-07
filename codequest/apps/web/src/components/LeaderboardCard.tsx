import { mockLeaderboard } from "../lib/mockData";

export default function LeaderboardCard() {
  return (
    <div
      className="p-4 rounded-[14px]"
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <TrophyIcon />
        <p className="text-[13px] font-medium">Class leaderboard</p>
      </div>
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        You&apos;re{" "}
        <span
          className="nums font-medium"
          style={{ color: "var(--color-text)" }}
        >
          #{mockLeaderboard.rank}
        </span>{" "}
        of {mockLeaderboard.totalStudents} in your class.{" "}
        <span className="nums">{mockLeaderboard.xpBehindNext}</span> XP behind the next spot.
      </p>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="9" x2="6" y2="2" />
      <line x1="18" y1="9" x2="18" y2="2" />
      <path d="M6 9a6 6 0 0 0 12 0" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}
