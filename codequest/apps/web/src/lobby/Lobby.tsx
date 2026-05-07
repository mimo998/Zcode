import { games, findGame } from "../games/registry";
import { currentStudent, progressByGame } from "../lib/mockData";
import { ContinueBanner } from "./ContinueBanner";
import { GameGrid } from "./GameGrid";
import { LeaderboardCard } from "./LeaderboardCard";
import { LobbyHeader } from "./LobbyHeader";
import { MentorTipCard } from "./MentorTipCard";
import { recentlyPlayed } from "./gameStatus";

export function Lobby() {
  const recent = recentlyPlayed(progressByGame);
  const recentGame = recent ? findGame(recent.gameId) : undefined;

  return (
    <div className="min-h-full bg-surface px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">

        <LobbyHeader student={currentStudent} />

        {recent && recentGame ? (
          <ContinueBanner game={recentGame} progress={recent} />
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <main className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-ink">Games</h2>
              <span className="rounded-full bg-surface-sunken px-2 py-0.5 text-xs font-medium text-ink-muted">
                {games.length}
              </span>
            </div>
            <GameGrid games={games} progressByGame={progressByGame} />
          </main>

          <aside className="flex flex-col gap-4">
            <MentorTipCard />
            <LeaderboardCard />
          </aside>
        </div>

      </div>
    </div>
  );
}
