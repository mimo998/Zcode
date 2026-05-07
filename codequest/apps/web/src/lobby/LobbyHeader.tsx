import type { CurrentStudent } from "../lib/mockData";

interface Props {
  student: CurrentStudent;
}

export function LobbyHeader({ student }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-raised p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft font-semibold text-accent-ink">
          {student.initials}
        </div>
        <div>
          <p className="text-sm text-ink-muted">{student.className}</p>
          <p className="text-lg font-semibold">{student.displayName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Stat label="XP" value={student.totalXp} accent="bg-accent-soft text-accent-ink" />
        <Stat
          label="Streak"
          value={`${student.streakDays}d`}
          accent="bg-amber-soft text-amber-ink"
        />
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${accent}`}>
      <span className="text-xs uppercase tracking-wide opacity-70">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
