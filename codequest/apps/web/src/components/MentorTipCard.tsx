import { mockMentorTip } from "../lib/mockData";

export default function MentorTipCard() {
  return (
    <div
      className="p-4 rounded-[14px]"
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <ChatIcon />
        <p className="text-[13px] font-medium">Mentor tip</p>
      </div>
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {mockMentorTip}
      </p>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
