import { Link } from "react-router-dom";
import type { GameDefinition } from "@codequest/games-sdk";
import type { GameProgress } from "@codequest/shared";
import { colorRamp } from "./colorRamp";
import type { GameStatus } from "./gameStatus";

interface Props {
  game: GameDefinition;
  status: GameStatus;
  progress?: GameProgress;
}

const statusConfig: Record<GameStatus, { label: string; dot: string; text: string }> = {
  locked:      { label: "Locked",      dot: "bg-slate-300",  text: "text-slate-500" },
  new:         { label: "New",         dot: "bg-accent",     text: "text-accent-ink" },
  "in-progress": { label: "In progress", dot: "bg-amber",   text: "text-amber-ink" },
  complete:    { label: "Complete",    dot: "bg-teal",       text: "text-teal-ink" },
};

export function GameCard({ game, status, progress }: Props) {
  const ramp = colorRamp[game.color];
  const locked = status === "locked";
  const pct =
    game.totalLevels === 0
      ? 0
      : Math.min(100, ((progress?.highestLevel ?? 0) / game.totalLevels) * 100);

  const inner = (
    <>
      {/* coloured accent stripe */}
      <div className={`h-1 w-full rounded-full ${ramp.chip} opacity-80`} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* icon + status row */}
        <div className="flex items-start justify-between gap-2">
          <div
            className={`grid h-11 w-11 place-items-center rounded-xl text-xl font-bold ${ramp.bg} ${ramp.ink}`}
          >
            {game.name.charAt(0)}
          </div>
          <StatusChip status={status} />
        </div>

        {/* text */}
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-base font-semibold leading-snug text-ink">{game.name}</h3>
          <p className="text-sm leading-relaxed text-ink-muted">{game.tagline}</p>
        </div>

        {/* progress */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
            <div
              className={`h-full rounded-full transition-all duration-500 ${ramp.chip}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="min-w-[3ch] text-right text-xs tabular-nums text-ink-faint">
            {progress?.highestLevel ?? 0}/{game.totalLevels}
          </span>
        </div>
      </div>
    </>
  );

  const base =
    "group flex flex-col overflow-hidden rounded-2xl bg-surface-raised shadow-card transition-all duration-200";

  if (locked) {
    return <div className={`${base} opacity-55 cursor-not-allowed`}>{inner}</div>;
  }

  return (
    <Link
      to={`/play/${game.id}`}
      className={`${base} hover:shadow-card-hover hover:-translate-y-1`}
    >
      {inner}
    </Link>
  );
}

function StatusChip({ status }: { status: GameStatus }) {
  const { label, dot, text } = statusConfig[status];
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className={`text-xs font-medium ${text}`}>{label}</span>
    </span>
  );
}
