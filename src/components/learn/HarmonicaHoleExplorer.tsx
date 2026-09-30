import { useRef, useState } from "react";

// Standard richter tuning, C harmonica, concert pitch. Well-documented
// standard instrument layout, not something that needs a historical source
// check the way a blues-history claim does.
const HOLES: { blow: number; draw: number; blowNote: string; drawNote: string }[] = [
  { blow: 261.63, draw: 293.66, blowNote: "C4", drawNote: "D4" },
  { blow: 329.63, draw: 392.0, blowNote: "E4", drawNote: "G4" },
  { blow: 392.0, draw: 493.88, blowNote: "G4", drawNote: "B4" },
  { blow: 523.25, draw: 587.33, blowNote: "C5", drawNote: "D5" },
  { blow: 659.25, draw: 698.46, blowNote: "E5", drawNote: "F5" },
  { blow: 783.99, draw: 880.0, blowNote: "G5", drawNote: "A5" },
  { blow: 1046.5, draw: 987.77, blowNote: "C6", drawNote: "B5" },
  { blow: 1318.51, draw: 1174.66, blowNote: "E6", drawNote: "D6" },
  { blow: 1567.98, draw: 1396.91, blowNote: "G6", drawNote: "F6" },
  { blow: 2093.0, draw: 1760.0, blowNote: "C7", drawNote: "A6" },
];

/**
 * Tap a hole (1-10) to see its blow/draw note and optionally hear it (Web
 * Audio oscillator, no audio file). C harmonica, standard richter tuning.
 */
export function HarmonicaHoleExplorer({
  highlight = [],
  labels,
}: {
  highlight?: number[];
  labels: { blow: string; draw: string; tap: string };
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState<"blow" | "draw">("draw");
  const ctxRef = useRef<AudioContext | null>(null);

  function playTone(freq: number) {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.72);
  }

  const tap = (holeIndex: number, dir: "blow" | "draw") => {
    setSelected(holeIndex);
    setDirection(dir);
    const h = HOLES[holeIndex];
    playTone(dir === "blow" ? h.blow : h.draw);
  };

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mb-3">
        {HOLES.map((h, i) => {
          const n = i + 1;
          const isHighlighted = highlight.includes(n);
          const isSelected = selected === i;
          return (
            <button
              key={n}
              type="button"
              onClick={() => tap(i, direction)}
              aria-label={`${labels.tap} ${n}`}
              className={`rounded-md border px-1 py-3 text-center text-xs transition-colors ${
                isSelected ? "border-gold bg-gold/25 text-gold" : isHighlighted ? "border-gold/50 bg-gold/5 text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => { setDirection("blow"); if (selected !== null) tap(selected, "blow"); }}
          className={`px-4 py-1.5 rounded-full text-sm transition ${direction === "blow" ? "bg-gold text-primary-foreground" : "bg-background border border-border hover:border-gold/50"}`}
        >
          {labels.blow}
        </button>
        <button
          type="button"
          onClick={() => { setDirection("draw"); if (selected !== null) tap(selected, "draw"); }}
          className={`px-4 py-1.5 rounded-full text-sm transition ${direction === "draw" ? "bg-gold text-primary-foreground" : "bg-background border border-border hover:border-gold/50"}`}
        >
          {labels.draw}
        </button>
      </div>

      {selected !== null && (
        <p className="text-center text-sm text-foreground/90">
          {labels.tap} {selected + 1} — {direction === "blow" ? labels.blow : labels.draw}: <span className="text-gold font-medium">{direction === "blow" ? HOLES[selected].blowNote : HOLES[selected].drawNote}</span>
        </p>
      )}
    </div>
  );
}
