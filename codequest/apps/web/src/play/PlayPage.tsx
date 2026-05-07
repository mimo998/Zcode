import { Link, useNavigate, useParams } from "react-router-dom";
import { findGame } from "../games/registry";

/**
 * Stub for the game runtime route. The real wrapper (mentor sidebar, progress
 * POST, exit handling) lands in issue #6. For now we mount the game with
 * minimal callbacks so the lobby → play handoff is exercisable end-to-end.
 */
export function PlayPage() {
  const { gameId = "" } = useParams();
  const navigate = useNavigate();
  const game = findGame(gameId);

  if (!game) {
    return (
      <div className="grid min-h-full place-items-center bg-surface px-6 py-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium uppercase tracking-wide text-ink-faint">
            404
          </p>
          <h1 className="text-2xl font-semibold">Game not found</h1>
          <p className="max-w-sm text-ink-muted">
            No game is registered under{" "}
            <code className="rounded bg-surface-sunken px-1.5 py-0.5 text-xs">
              {gameId}
            </code>
            .
          </p>
          <Link
            to="/"
            className="mt-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Back to lobby
          </Link>
        </div>
      </div>
    );
  }

  const Game = game.Component;
  return (
    <div className="min-h-full bg-surface">
      <Game
        level={1}
        onLevelComplete={() => navigate("/")}
        onMentorRequest={() => {
          /* mentor sidebar wired up in #9 */
        }}
        onExit={() => navigate("/")}
      />
    </div>
  );
}
