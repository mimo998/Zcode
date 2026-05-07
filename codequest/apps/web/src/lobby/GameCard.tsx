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

export function GameCard({ game, status, progress }: Props) {
  const ramp = colorRamp[game.color];
  const interactive = status !== "locked";
  const cardClasses = `group relative flex h-full flex-col gap-4 rounded-2xl bg-surface-raised p-5 shadow-card transition ${
    interactive ? "hover:shadow-card-hover hover:-translate-y-0.5" : "opacity-60"
  }`;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={`grid h-12 w-12 place-items-center rounded-xl ${ramp.bg} ${ramp.ink} text-xl font-semibold`}
          aria-hidden
        >
          {game.name.charAt(0)}
        </div>
        <StatusChip status={status} />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-lg font-semibold leading-tight">{game.name}</h3>
        <p className="text-sm text-ink-muted">{game.tagline}</p>
      </div>

      <ProgressBar
        color={game.color}
        completed={progress?.highestLevel ?? 0}
        total={game.totalLevels}
      />
    </>
  );

  if (!interactive) {
    return (
      <div className={cardClasses} aria-disabled>
        {inner}
      </div>
    );
  }

  return (
    <Link to={`/play/${game.id}`} className={cardClasses}>
      {inner}
    </Link>
  );
}

function StatusChip({ status }: { status: GameStatus }) {
  const map: Record<GameStatus, { label: string; className: string }> = {
    locked: { label: "Locked", className: "bg-surface-sunken text-ink-muted" },
    new: { label: "New", className: "bg-accent-soft text-accent-ink" },
    "in-progress": {
      label: "In progress",
      className: "bg-amber-soft text-amber-ink",
    },
    complete: { label: "Complete", className: "bg-teal-soft text-teal-ink" },
  };
  const { label, className } = map[status];
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function ProgressBar({
  color,
  completed,
  total,
}: {
  color: GameDefinition["color"];
  completed: number;
  total: number;
}) {
  const ramp = colorRamp[color];
  const pct = total === 0 ? 0 : Math.min(100, (completed / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={`h-full rounded-full ${ramp.chip}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-ink-muted">
        {completed}/{total}
      </span>
    </div>
  );
}
