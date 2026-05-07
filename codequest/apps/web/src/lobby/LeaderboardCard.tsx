import { mockLeaderboard } from "../lib/mockData";

/**
 * Placeholder leaderboard. Real data lands with teacher dashboard (#10).
 */
const medals = ["🥇", "🥈", "🥉"];
const medalColors = [
  "bg-amber-soft text-amber-ink",
  "bg-surface-sunken text-ink-muted",
  "bg-coral-soft text-coral-ink",
];

const placeholderRows = [
  { rank: 1, name: "—", xp: 0 },
  { rank: 2, name: "—", xp: 0 },
  { rank: 3, name: "—", xp: 0 },
];

export function LeaderboardCard() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-surface-raised p-5 shadow-card">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Class leaderboard</h2>
        <span className="text-xs text-ink-faint">This week</span>
      </header>

      <ul className="flex flex-col gap-2">
        {placeholderRows.map((row, i) => (
          <li
            key={row.rank}
            className="flex items-center justify-between rounded-xl bg-surface-sunken px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid h-7 w-7 place-items-center rounded-lg text-sm ${medalColors[i] ?? "bg-surface-sunken text-ink-muted"}`}
              >
                {medals[i] ?? row.rank}
              </span>
              <span className="text-sm font-medium text-ink">{row.name}</span>
            </div>
            <span className="text-xs font-semibold tabular-nums text-ink-muted">
              {row.xp} XP
            </span>
          </li>
        ))}
      </ul>

      <div className="rounded-xl bg-accent-soft px-3 py-2 text-center">
        <p className="text-xs text-accent-ink font-medium">
          You're #{mockLeaderboard.rank} out of {mockLeaderboard.totalStudents} students
        </p>
        <p className="text-xs text-ink-faint mt-0.5">
          {mockLeaderboard.xpBehindNext} XP behind #{mockLeaderboard.rank - 1}
        </p>
      </div>
    </section>
  );
}
