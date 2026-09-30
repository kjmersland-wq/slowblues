import { useRef, useState } from "react";

// Standard guitar tuning, low to high, concert pitch (A4 = 440 Hz).
const STRINGS: { name: string; freq: number }[] = [
  { name: "E", freq: 82.41 },
  { name: "A", freq: 110.0 },
  { name: "D", freq: 146.83 },
  { name: "G", freq: 196.0 },
  { name: "B", freq: 246.94 },
  { name: "e", freq: 329.63 },
];

/**
 * Six reference tones (Web Audio oscillators, no audio file) for tuning by
 * ear. Press and hold, or tap to sustain ~2s.
 */
export function TuningTones({ label }: { label: string }) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  function getCtx(): AudioContext {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current;
  }

  function stopTone() {
    const ctx = ctxRef.current;
    const node = nodeRef.current;
    if (ctx && node) {
      const now = ctx.currentTime;
      node.gain.gain.cancelScheduledValues(now);
      node.gain.gain.setValueAtTime(node.gain.gain.value, now);
      node.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      node.osc.stop(now + 0.09);
    }
    nodeRef.current = null;
    setPlayingIndex(null);
  }

  function playTone(i: number) {
    stopTone();
    const ctx = getCtx();
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = STRINGS[i].freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    nodeRef.current = { osc, gain };
    setPlayingIndex(i);
  }

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <p className="text-xs text-muted-foreground mb-3">{label}</p>
      <div className="grid grid-cols-6 gap-1.5">
        {STRINGS.map((s, i) => (
          <button
            key={s.name + i}
            type="button"
            onMouseDown={() => playTone(i)}
            onMouseUp={stopTone}
            onMouseLeave={() => playingIndex === i && stopTone()}
            onTouchStart={(e) => { e.preventDefault(); playTone(i); }}
            onTouchEnd={stopTone}
            className={`rounded-md border px-2 py-3 text-center font-display text-lg transition-colors ${
              playingIndex === i ? "border-gold bg-gold/20 text-gold" : "border-border text-foreground hover:border-gold/40"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
