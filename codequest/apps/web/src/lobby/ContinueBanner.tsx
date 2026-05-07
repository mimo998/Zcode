import { Link } from "react-router-dom";
import type { GameDefinition } from "@codequest/games-sdk";
import type { GameProgress } from "@codequest/shared";
import { colorRamp } from "./colorRamp";

interface Props {
  game: GameDefinition;
  progress: GameProgress;
}

export function ContinueBanner({ game, progress }: Props) {
  const ramp = colorRamp[game.color];
  const nextLevel = progress.highestLevel + 1;

  return (
    <div
      className={`relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl ${ramp.bg} px-6 py-5 shadow-card`}
    >
      <div className="flex flex-col gap-0.5">
        <p className={`text-xs font-semibold uppercase tracking-widest ${ramp.ink} opacity-70`}>
          Continue where you left off
        </p>
        <p className="text-lg font-bold text-ink">{game.name}</p>
        <p className="text-sm text-ink-muted">
          Level {nextLevel} of {game.totalLevels}
        </p>
      </div>

      <Link
        to={`/play/${game.id}`}
        className={`relative z-10 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 ${ramp.chip}`}
      >
        Resume
        <span className="text-base leading-none">→</span>
      </Link>

      {/* decorative circle */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-20 ${ramp.chip}`}
      />
    </div>
  );
}
