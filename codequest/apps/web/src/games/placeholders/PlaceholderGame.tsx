import type { GameProps } from "@codequest/games-sdk";

/**
 * A stand-in component used by all four games until their real implementations land.
 * It implements the GameProps contract so the lobby can wire up to it as if it were real.
 *
 * When a real game ships (e.g. issue #13 for Maze Runner), it replaces this component
 * in the corresponding GameDefinition entry in registry.ts. Nothing else changes.
 */
export default function PlaceholderGame({ level, onLevelComplete, onExit }: GameProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        className="w-full max-w-lg p-8 rounded-[14px]"
        style={{
          background: "var(--color-surface)",
          border: "0.5px solid var(--color-border)",
        }}
      >
        <p
          className="text-sm uppercase tracking-wider mb-2"
          style={{ color: "var(--color-text-subtle)" }}
        >
          Placeholder
        </p>
        <h1 className="text-xl font-semibold mb-2">Game not yet implemented</h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          Starting at level {level}. The real game will be built in a separate issue.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              onLevelComplete({
                level,
                passed: true,
                timeSpent: 0,
                attempts: 1,
              })
            }
            className="px-4 py-2 text-sm rounded-[10px] transition-colors"
            style={{
              background: "var(--color-accent)",
              color: "white",
            }}
          >
            Simulate level complete
          </button>
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 text-sm rounded-[10px] transition-colors"
            style={{
              background: "transparent",
              border: "0.5px solid var(--color-border-strong)",
              color: "var(--color-text)",
            }}
          >
            Back to lobby
          </button>
        </div>
      </div>
    </div>
  );
}
