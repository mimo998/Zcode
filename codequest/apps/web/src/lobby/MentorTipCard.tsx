/**
 * Placeholder for the per-student mentor tip. Real content arrives in #11
 * (teacher dashboard AI summary feeds the mentor with longitudinal data).
 */
export function MentorTipCard() {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-surface-raised p-5 shadow-card">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Mentor tip
        </h2>
        <span className="rounded-full bg-purple-soft px-2.5 py-0.5 text-xs font-medium text-purple-ink">
          AI
        </span>
      </header>
      <p className="text-base leading-relaxed">
        Your mentor will surface a personal tip here once you start playing.
      </p>
      <p className="text-xs text-ink-faint">
        Powered by your activity — not a generic message.
      </p>
    </section>
  );
}
