import { mockMentorTip } from "../lib/mockData";

/**
 * Shows the AI mentor's most recent tip for this student.
 * Real content streams from POST /api/mentor/message — wired up in #8 + #9.
 */
export function MentorTipCard() {
  return (
    <section className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-soft to-accent-soft p-5 shadow-card">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-purple text-sm text-white">
            ✦
          </span>
          <h2 className="text-sm font-semibold text-purple-ink">AI Mentor</h2>
        </div>
        <span className="rounded-full bg-purple/10 px-2.5 py-0.5 text-xs font-medium text-purple-ink">
          Beta
        </span>
      </header>

      <div className="flex items-start gap-2 rounded-xl bg-white/60 px-3 py-3">
        <span className="mt-0.5 text-sm">💡</span>
        <p className="text-sm leading-relaxed text-ink-muted italic">{mockMentorTip}</p>
      </div>

      <p className="text-xs text-ink-faint">
        Based on your last session · updated after each play
      </p>
    </section>
  );
}
