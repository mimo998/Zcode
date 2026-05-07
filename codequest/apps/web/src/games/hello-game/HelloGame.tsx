import type { GameProps } from "@codequest/games-sdk";
import { useState } from "react";

export function HelloGame({ level, onLevelComplete, onExit }: GameProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleComplete() {
    setSubmitted(true);
    onLevelComplete({
      level,
      passed: true,
      timeSpent: 1,
      attempts: 1,
    });
  }

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-sm uppercase tracking-wide text-ink-faint">
        Level {level}
      </p>
      <h1 className="text-2xl font-semibold">HelloGame</h1>
      <p className="text-ink-muted">
        A 30-line stub used to validate the SDK plumbing end-to-end before any
        real game exists.
      </p>
      {submitted ? (
        <p className="text-teal-ink">Level complete — returning to lobby…</p>
      ) : (
        <button
          type="button"
          className="rounded-xl bg-accent px-5 py-3 font-medium text-white shadow-card hover:shadow-card-hover"
          onClick={handleComplete}
        >
          Press the button
        </button>
      )}
      <button
        type="button"
        className="text-sm text-ink-muted underline-offset-4 hover:underline"
        onClick={onExit}
      >
        Exit to lobby
      </button>
    </div>
  );
}
