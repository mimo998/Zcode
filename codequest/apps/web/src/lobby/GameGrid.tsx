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
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-muted">
        No games registered yet. Add one in{" "}
        <code className="rounded bg-surface-sunken px-1.5 py-0.5 text-xs">
          apps/web/src/games/registry.ts
        </code>
        .
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
