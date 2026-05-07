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
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl ${ramp.bg} p-5 shadow-card`}
    >
      <div>
        <p className={`text-xs font-medium uppercase tracking-wide ${ramp.ink}`}>
          Continue where you left off
        </p>
        <p className="mt-1 text-lg font-semibold text-ink">{game.name}</p>
        <p className="text-sm text-ink-muted">
          Level {progress.highestLevel + 1} of {game.totalLevels}
        </p>
      </div>
      <Link
        to={`/play/${game.id}`}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium ${ramp.chip}`}
      >
        Resume
      </Link>
    </div>
  );
}
