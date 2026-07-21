export default function BackgroundDark() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-dark"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="#8B949E"
            strokeWidth="1"
            opacity="0.14"
          />
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#grid-dark)" />

      <g opacity="0.7">
        {Array.from({ length: 8 }).map((_, i) => {
          const yBase = 560 + i * 26;
          const amp = 60 - i * 5;
          return (
            <path
              key={i}
              d={`M 760 ${yBase} C 900 ${yBase - amp}, 1040 ${yBase + amp}, 1200 ${yBase}`}
              fill="none"
              stroke="#8B93F8"
              strokeWidth="1.25"
              opacity={0.55 - i * 0.04}
            />
          );
        })}
      </g>

      {[
        [1020, 540], [1080, 510], [1140, 560], [1160, 500],
        [1100, 600], [1180, 570], [1040, 620], [1200, 620],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#6F0A88" opacity="0.9" />
      ))}
      {[
        [1020, 540], [1140, 560], [1100, 600], [1200, 620],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="6" fill="#6F0A88" opacity="0.18" />
      ))}
    </svg>
  );
}