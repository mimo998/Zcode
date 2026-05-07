import Header from "../components/Header";
import ContinueBanner from "../components/ContinueBanner";
import GameCard from "../components/GameCard";
import MentorTipCard from "../components/MentorTipCard";
import LeaderboardCard from "../components/LeaderboardCard";
import { games } from "../games/registry";
import { useUser } from "../lib/progressStore";

export default function LobbyRoute() {
  const user = useUser();

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <Header />

        <section className="mb-6">
          <h1 className="text-[22px] font-semibold mb-1">
            Hey {user.displayName}
          </h1>
          <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
            Pick a world to dive into.
          </p>
        </section>

        <ContinueBanner />

        <p
          className="text-[12px] uppercase tracking-wider mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Worlds
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MentorTipCard />
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
}
