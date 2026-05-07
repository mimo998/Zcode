import { useNavigate, useParams } from "react-router-dom";
import { findGame } from "../games/registry";
import { useProgressStore } from "../lib/progressStore";
import type { LevelResult, MentorContext } from "@codequest/games-sdk";

/**
 * The game runtime wrapper. Mounts the game from the registry and supplies the GameProps
 * callbacks. Issue #6 will flesh this out with real progress writes, mentor sidebar, and
 * compatibility checks. For now it logs the events and returns to the lobby.
 */
export default function GamePlaceholderRoute() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const game = gameId ? findGame(gameId) : undefined;
  const progress = useProgressStore((s) => (gameId ? s.progress[gameId] : undefined));

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div
          className="max-w-md p-6 rounded-[14px] text-center"
          style={{
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
          }}
        >
          <p className="text-[15px] font-medium mb-2">Game not found</p>
          <p
            className="text-[13px] mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            We don&apos;t have a game called <code>{gameId}</code>.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-[13px] font-medium rounded-[10px]"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            Back to lobby
          </button>
        </div>
      </div>
    );
  }

  const startingLevel = (progress?.highestLevel ?? 0) + 1;

  const handleLevelComplete = (result: LevelResult) => {
    // Issue #7 will POST this to /api/attempts. For now: log and return to lobby.
    console.log("[lobby] level complete", { gameId: game.id, result });
    navigate("/");
  };

  const handleMentorRequest = (context: MentorContext) => {
    // Issue #9 will open the mentor sidebar. For now: log.
    console.log("[lobby] mentor requested", { gameId: game.id, context });
  };

  const handleExit = () => navigate("/");

  const Component = game.Component;
  return (
    <Component
      level={startingLevel}
      onLevelComplete={handleLevelComplete}
      onMentorRequest={handleMentorRequest}
      onExit={handleExit}
    />
  );
}
