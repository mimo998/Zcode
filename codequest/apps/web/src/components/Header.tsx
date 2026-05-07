import { useUser } from "../lib/progressStore";

export default function Header() {
  const user = useUser();

  return (
    <header
      className="flex items-center justify-between pb-4 mb-6"
      style={{ borderBottom: "0.5px solid var(--color-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-sm font-semibold"
          style={{
            background: "var(--color-accent-bg)",
            color: "var(--color-accent-text)",
          }}
        >
          CQ
        </div>
        <span className="font-semibold text-[15px]">CodeQuest</span>
        <span
          className="text-[13px] ml-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          {user.className} · {user.teacherName}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <Stat
          label="day streak"
          value={user.streakDays}
          icon={<FlameIcon />}
        />
        <Stat label="XP" value={user.totalXp.toLocaleString()} icon={<StarIcon />} />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold"
          style={{
            background: "var(--color-accent-bg)",
            color: "var(--color-accent-text)",
          }}
          aria-label={user.displayName}
          title={user.displayName}
        >
          {user.initials}
        </div>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-1.5 text-[13px]"
      style={{ color: "var(--color-text-muted)" }}
    >
      {icon}
      <span className="nums font-medium" style={{ color: "var(--color-text)" }}>
        {value}
      </span>
      <span>{label}</span>
    </div>
  );
}

function FlameIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-success)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
