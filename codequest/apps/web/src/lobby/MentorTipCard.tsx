/**
 * Placeholder for the per-student mentor tip. Real content arrives in #11.
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
          Coming soon
        </span>
      </header>

      <p className="text-sm leading-relaxed text-ink-muted">
        Your mentor will surface a personalised tip here once you start playing — based
        on where you're stuck, not a generic message.
      </p>

      <div className="flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2">
        <span className="text-sm">💡</span>
        <p className="text-xs text-ink-muted italic">
          "Great engineers get stuck. The skill is knowing what to try next."
        </p>
      </div>
    </section>
  );
}
