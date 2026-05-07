import type { GameDefinition } from "@codequest/games-sdk";
import type { GameProgress } from "@codequest/shared";
import { GameCard } from "./GameCard";
import { statusFor } from "./gameStatus";

interface Props {
  games: GameDefinition[];
  progressByGame: Record<string, GameProgress>;
}

export function GameGrid({ games, progressByGame }: Props) {
  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-sm text-ink-muted">No games registered yet.</p>
        <p className="mt-1 text-xs text-ink-faint">
          Add one in{" "}
          <code className="rounded bg-surface-sunken px-1.5 py-0.5">
            apps/web/src/games/registry.ts
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          status={statusFor(game, progressByGame)}
          progress={progressByGame[game.id]}
        />
      ))}
    </div>
  );
}
