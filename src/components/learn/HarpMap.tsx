// A labeled diagram of a 10-hole diatonic harmonica, comb-side view, in the
// site's gold/cream-on-dark palette. Holes 1-10 left to right (low to high),
// with the active hole(s) and breath direction highlighted per lesson.
export function HarpMap({
  highlight = [],
  direction,
  className,
  label,
}: {
  highlight?: number[];
  direction?: "blow" | "draw";
  className?: string;
  label?: string;
}) {
  const holeX = (n: number) => 20 + (n - 1) * 24;
  const HOLES = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <figure className={`inline-flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg viewBox="0 0 280 90" width="280" height="90" role="img" aria-label={label ?? "Harmonica hole diagram"} className="text-gold">
        {/* body */}
        <rect x="8" y="18" width="264" height="40" rx="6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.6} />
        {/* holes */}
        {HOLES.map((n) => {
          const active = highlight.includes(n);
          return (
            <g key={n}>
              <rect
                x={holeX(n) - 8}
                y={28}
                width={16}
                height={20}
                rx={3}
                fill={active ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={1.2}
                fillOpacity={active ? 0.85 : 1}
              />
              <text x={holeX(n)} y={72} textAnchor="middle" fontSize="9" fill="currentColor" opacity={0.75}>
                {n}
              </text>
            </g>
          );
        })}
        {/* left/right + breath-direction labels */}
        <text x="8" y="12" fontSize="9" fill="currentColor" opacity={0.6}>LOW / LEFT</text>
        <text x="272" y="12" textAnchor="end" fontSize="9" fill="currentColor" opacity={0.6}>HIGH / RIGHT</text>
        {direction && highlight.length > 0 && (
          <text x={holeX(highlight[Math.floor(highlight.length / 2)])} y="10" textAnchor="middle" fontSize="9" fontWeight={600} fill="currentColor">
            {direction === "blow" ? "BLOW →" : "← DRAW"}
          </text>
        )}
      </svg>
      {label && <figcaption className="text-xs text-muted-foreground text-center max-w-[220px]">{label}</figcaption>}
    </figure>
  );
}
