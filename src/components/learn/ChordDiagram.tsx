// Simple open-position chord diagrams (6 strings, 4 frets) in the site's
// own gold/cream-on-dark palette — no stock photos, no design-system
// additions, just inline SVG reusing the existing color tokens.
type Dot = { string: number; fret: number }; // string 1 = low E (left) .. 6 = high E (right)
type ChordShape = { name: string; dots: Dot[]; open: number[]; muted: number[] };

// String 1 = low E .. string 6 = high e. Standard open-position fingerings:
// E = 022100, A = x02220, B7 = x21202.
const SHAPES: Record<string, ChordShape> = {
  E: { name: "E", dots: [{ string: 2, fret: 2 }, { string: 3, fret: 2 }, { string: 4, fret: 1 }], open: [1, 5, 6], muted: [] },
  A: { name: "A", dots: [{ string: 3, fret: 2 }, { string: 4, fret: 2 }, { string: 5, fret: 2 }], open: [2, 6], muted: [1] },
  B7: { name: "B7", dots: [{ string: 2, fret: 2 }, { string: 3, fret: 1 }, { string: 4, fret: 2 }, { string: 6, fret: 2 }], open: [5], muted: [1] },
};

export function ChordDiagram({ chord, className, label }: { chord: "E" | "A" | "B7"; className?: string; label?: string }) {
  const shape = SHAPES[chord];
  const stringX = (s: number) => 12 + (s - 1) * 16; // 6 strings across 92px
  const fretY = (f: number) => 24 + f * 24;
  const NUT_Y = 24;
  const LAST_FRET_Y = fretY(4);

  return (
    <figure className={`inline-flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg viewBox="0 0 104 140" width="104" height="140" role="img" aria-label={label ?? `${shape.name} chord diagram`} className="text-gold">
        {/* nut */}
        <rect x="10" y={NUT_Y - 3} width="82" height="4" fill="currentColor" />
        {/* frets */}
        {[1, 2, 3, 4].map((f) => (
          <line key={f} x1="12" y1={fretY(f)} x2="92" y2={fretY(f)} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
        ))}
        {/* strings */}
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <line key={s} x1={stringX(s)} y1={NUT_Y} x2={stringX(s)} y2={LAST_FRET_Y} stroke="currentColor" strokeOpacity={0.55} strokeWidth={1} />
        ))}
        {/* open / muted markers above the nut */}
        {[1, 2, 3, 4, 5, 6].map((s) => {
          if (shape.open.includes(s)) {
            return <circle key={`o${s}`} cx={stringX(s)} cy={NUT_Y - 12} r={4} fill="none" stroke="currentColor" strokeWidth={1.5} />;
          }
          if (shape.muted.includes(s)) {
            return (
              <text key={`m${s}`} x={stringX(s)} y={NUT_Y - 7} textAnchor="middle" fontSize="10" fill="currentColor" opacity={0.7}>
                ×
              </text>
            );
          }
          return null;
        })}
        {/* finger dots */}
        {shape.dots.map((d, i) => (
          <circle key={i} cx={stringX(d.string)} cy={fretY(d.fret) - 12} r={6} fill="currentColor" />
        ))}
      </svg>
      <figcaption className="text-xs text-muted-foreground">{label ?? `${shape.name} shape`}</figcaption>
    </figure>
  );
}
