import { ChordDiagram } from "./ChordDiagram";
import { HarpMap } from "./HarpMap";

// Simple, abstract line-art diagrams in the site's gold/dark palette — not
// attempts at realistic figures (those need real illustration iteration
// this pass doesn't have room for), but honest original SVGs, never a
// stock photo or a hotlinked image.

function HoldGuitarDiagram({ label }: { label?: string }) {
  return (
    <figure className="inline-flex flex-col items-center gap-2">
      <svg viewBox="0 0 160 140" width="160" height="140" role="img" aria-label={label ?? "Guitar hold diagram"} className="text-gold">
        {/* seated torso, simplified */}
        <path d="M40 130 Q40 90 55 80" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={2} />
        {/* guitar body against torso */}
        <ellipse cx="70" cy="95" rx="26" ry="32" fill="none" stroke="currentColor" strokeWidth={2} />
        <ellipse cx="70" cy="95" rx="10" ry="12" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
        {/* neck angled up */}
        <line x1="92" y1="80" x2="150" y2="30" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        {/* headstock */}
        <rect x="146" y="20" width="10" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth={1.5} />
        {/* picking-hand arrow near sound hole/bridge */}
        <path d="M78 100 l14 -6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <path d="M92 94 l-5 1 l1 -5" fill="none" stroke="currentColor" strokeWidth={1.5} />
      </svg>
      {label && <figcaption className="text-xs text-muted-foreground text-center max-w-[160px]">{label}</figcaption>}
    </figure>
  );
}

function HoldHarmonicaDiagram({ label }: { label?: string }) {
  return (
    <figure className="inline-flex flex-col items-center gap-2">
      <svg viewBox="0 0 160 120" width="160" height="120" role="img" aria-label={label ?? "Harmonica hold diagram"} className="text-gold">
        {/* simplified face outline */}
        <circle cx="115" cy="55" r="30" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={2} />
        {/* mouth, soft "ooh" shape */}
        <ellipse cx="90" cy="60" rx="6" ry="8" fill="none" stroke="currentColor" strokeWidth={2} />
        {/* harmonica body */}
        <rect x="30" y="52" width="46" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth={2} />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line key={i} x1={34 + i * 5} y1="54" x2={34 + i * 5} y2="66" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1} />
        ))}
        {/* cupped hand outline under the harp */}
        <path d="M26 68 Q52 84 82 68" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
      </svg>
      {label && <figcaption className="text-xs text-muted-foreground text-center max-w-[160px]">{label}</figcaption>}
    </figure>
  );
}

function PentatonicBoxDiagram({ label }: { label?: string }) {
  // A minor pentatonic, box 1, frets 5-8 on a standard-tuned fretboard —
  // shown as a small 6x4-fret grid with root notes marked.
  const dots: { string: number; fret: number; root?: boolean }[] = [
    { string: 1, fret: 5, root: true }, { string: 1, fret: 8 },
    { string: 2, fret: 5 }, { string: 2, fret: 8 },
    { string: 3, fret: 5 }, { string: 3, fret: 7 },
    { string: 4, fret: 5 }, { string: 4, fret: 7 },
    { string: 5, fret: 5, root: true }, { string: 5, fret: 8 },
    { string: 6, fret: 5, root: true }, { string: 6, fret: 8 },
  ];
  const stringY = (s: number) => 10 + (s - 1) * 14;
  const fretX = (f: number) => 10 + (f - 5) * 30;
  return (
    <figure className="inline-flex flex-col items-center gap-2">
      <svg viewBox="0 0 130 90" width="180" height="125" role="img" aria-label={label ?? "A minor pentatonic, box 1, fretboard diagram"} className="text-gold">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <line key={s} x1="10" y1={stringY(s)} x2="120" y2={stringY(s)} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} />
        ))}
        {[5, 6, 7, 8].map((f) => (
          <line key={f} x1={fretX(f)} y1="6" x2={fretX(f)} y2="80" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
        ))}
        <text x="10" y="88" fontSize="8" fill="currentColor" opacity={0.6}>fret 5</text>
        <text x="105" y="88" fontSize="8" fill="currentColor" opacity={0.6}>fret 8</text>
        {dots.map((d, i) => (
          <circle key={i} cx={fretX(d.fret)} cy={stringY(d.string)} r={4} fill={d.root ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} />
        ))}
      </svg>
      {label && <figcaption className="text-xs text-muted-foreground text-center max-w-[180px]">{label}</figcaption>}
    </figure>
  );
}

export type IllustrationV2 =
  | { kind: "chord"; chord: "A7" | "D7" | "E7" | "B7" | "A" | "E" }
  | { kind: "harp"; highlight: number[]; direction?: "blow" | "draw" }
  | { kind: "hold-guitar" }
  | { kind: "hold-harmonica" }
  | { kind: "pentatonic-box" };

export function IllustrationBlockV2({ illustration, label }: { illustration: IllustrationV2; label?: string }) {
  switch (illustration.kind) {
    case "chord":
      return <ChordDiagram chord={illustration.chord} label={label} />;
    case "harp":
      return <HarpMap highlight={illustration.highlight} direction={illustration.direction} label={label} />;
    case "hold-guitar":
      return <HoldGuitarDiagram label={label} />;
    case "hold-harmonica":
      return <HoldHarmonicaDiagram label={label} />;
    case "pentatonic-box":
      return <PentatonicBoxDiagram label={label} />;
    default:
      return null;
  }
}
