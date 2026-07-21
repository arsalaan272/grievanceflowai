const stages = [
  { label: "Submitted", cx: 60, colorClass: "fill-secondary dark:fill-secondary-dark" },
  { label: "In Progress", cx: 220, colorClass: "fill-accent dark:fill-accent-dark" },
  { label: "Resolved", cx: 380, colorClass: "fill-primary dark:fill-primary-dark" },
];

export default function StatusThread() {
  return (
    <svg
      viewBox="0 0 440 140"
      className="w-full max-w-md"
      role="img"
      aria-label="A complaint moves through three stages: submitted, in progress, and resolved."
    >
      <path
        d="M 60 70 C 140 20, 160 120, 220 70 S 320 20, 380 70"
        fill="none"
        stroke="currentColor"
        className="text-border dark:text-border-dark"
        strokeWidth="2"
      />
      <path
        d="M 60 70 C 140 20, 160 120, 220 70 S 320 20, 380 70"
        fill="none"
        stroke="url(#threadGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        className="thread-path"
      />
      <defs>
        <linearGradient id="threadGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4C5FD5" />
          <stop offset="50%" stopColor="#9A2FE6" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>

      {stages.map((s, i) => (
        <g key={s.label}>
          <circle
            cx={s.cx}
            cy="70"
            r="9"
            className={`${s.colorClass} ${i === stages.length - 1 ? "pulse-node" : ""}`}
          />
          <text
            x={s.cx}
            y="105"
            textAnchor="middle"
            className="fill-text-secondary dark:fill-text-secondary-dark font-heading text-[11px] font-medium uppercase tracking-wide"
          >
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}