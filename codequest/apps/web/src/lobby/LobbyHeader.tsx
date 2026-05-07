import type { CurrentStudent } from "../lib/mockData";

interface Props {
  student: CurrentStudent;
}

export function LobbyHeader({ student }: Props) {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-indigo-500/20 ring-2 ring-indigo-400/40 text-lg font-bold tracking-tight">
              {student.initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">{student.className}</p>
            <p className="text-xl font-semibold">{student.displayName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatBadge emoji="⚡" label="XP" value={student.totalXp} color="indigo" />
          <StatBadge emoji="🔥" label="Streak" value={`${student.streakDays}d`} color="amber" />
        </div>
      </div>

      {/* decorative background blobs */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-indigo-500/10" />
      <div className="pointer-events-none absolute -bottom-6 right-24 h-28 w-28 rounded-full bg-purple-500/10" />
    </header>
  );
}

function StatBadge({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: string | number;
  color: "indigo" | "amber";
}) {
  const colors = {
    indigo: "bg-indigo-500/20 ring-indigo-500/30 text-indigo-200",
    amber: "bg-amber-500/20 ring-amber-500/30 text-amber-200",
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 ring-1 ${colors[color]}`}
    >
      <span className="text-base leading-none">{emoji}</span>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] uppercase tracking-widest opacity-60">{label}</span>
        <span className="text-lg font-semibold">{value}</span>
      </div>
    </div>
  );
}
