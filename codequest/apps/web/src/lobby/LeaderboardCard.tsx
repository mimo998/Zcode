/**
 * Placeholder leaderboard for the lobby sidebar. Real data lands with the
 * teacher dashboard endpoints (issue #10).
 */
const placeholderRows = [
  { rank: 1, name: "—", xp: 0 },
  { rank: 2, name: "—", xp: 0 },
  { rank: 3, name: "—", xp: 0 },
];

export function LeaderboardCard() {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-surface-raised p-5 shadow-card">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Class leaderboard
        </h2>
        <span className="text-xs text-ink-faint">This week</span>
      </header>
      <ul className="flex flex-col gap-2">
        {placeholderRows.map((row) => (
          <li
            key={row.rank}
            className="flex items-center justify-between rounded-xl bg-surface-sunken px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-surface-raised text-xs font-semibold text-ink-muted">
                {row.rank}
              </span>
              <span className="text-sm">{row.name}</span>
            </div>
            <span className="text-sm font-medium text-ink-muted">
              {row.xp} XP
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
