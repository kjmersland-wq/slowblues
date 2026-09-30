import { useEffect, useRef, useState } from "react";
import { Play, Square, Volume2, VolumeX } from "lucide-react";

export type ChordChart = string[]; // exactly 12 entries, one chord label per bar

// Standard 12-bar I-IV-I-V-IV-I turnaround, filled in with the chart's own
// chord names so nothing here hardcodes a key.
export function buildChart(I: string, IV: string, V: string, quickChange = false): ChordChart {
  return quickChange
    ? [I, IV, I, I, IV, IV, I, I, V, IV, I, V]
    : [I, I, I, I, IV, IV, I, I, V, IV, I, V];
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * A 12-bar grid with its own Web Audio click track (no audio file needed --
 * short oscillator blips). Runs entirely independently of any embedded
 * YouTube video; the UI says so explicitly rather than implying sync it
 * can't actually guarantee.
 */
export function TwelveBarCounter({ chart, labels }: { chart: ChordChart; labels: { bar: string; beat: string; standalone: string; start: string; stop: string; mute: string; bpm: string } }) {
  const [bpm, setBpm] = useState(60);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [position, setPosition] = useState<{ bar: number; beat: number } | null>(null); // bar 0 = count-in
  const reducedMotion = usePrefersReducedMotion();

  const ctxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const beatCounterRef = useRef(0); // 0..3 within a bar, or count-in beats
  const barCounterRef = useRef(0); // 0 = count-in, 1..12 = bars
  const timerRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const scheduleAheadTime = 0.1; // seconds
  const lookaheadMs = 25;

  function getCtx(): AudioContext {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current;
  }

  function playClick(time: number, accent: boolean) {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accent ? 1400 : 900;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.25 : 0.15, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.06);
  }

  function scheduler() {
    const ctx = ctxRef.current;
    if (!ctx || !runningRef.current) return;
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const isCountIn = barCounterRef.current === 0;
      const accent = beatCounterRef.current === 0;
      if (!muted) playClick(nextNoteTimeRef.current, accent && !isCountIn);
      const barToShow = barCounterRef.current;
      const beatToShow = beatCounterRef.current;
      const t = nextNoteTimeRef.current;
      const delay = Math.max(0, (t - ctx.currentTime) * 1000);
      window.setTimeout(() => setPosition({ bar: barToShow, beat: beatToShow }), delay);

      nextNoteTimeRef.current += 60 / bpm;
      beatCounterRef.current++;
      if (beatCounterRef.current >= 4) {
        beatCounterRef.current = 0;
        barCounterRef.current++;
        if (barCounterRef.current > 12) barCounterRef.current = 1; // count-in only happens once
      }
    }
    timerRef.current = window.setTimeout(scheduler, lookaheadMs);
  }

  function start() {
    const ctx = getCtx();
    if (ctx.state === "suspended") void ctx.resume();
    runningRef.current = true;
    setRunning(true);
    barCounterRef.current = 0;
    beatCounterRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime + 0.1;
    scheduler();
  }

  function stop() {
    runningRef.current = false;
    setRunning(false);
    setPosition(null);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }

  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const isCountIn = position?.bar === 0;

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={running ? stop : start}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-gold text-primary-foreground text-sm font-medium hover:bg-gold/90 transition"
        >
          {running ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
          {running ? labels.stop : labels.start}
        </button>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={labels.mute}
          aria-pressed={muted}
          className="p-1.5 rounded-md border border-border hover:border-gold/50 transition"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {labels.bpm}
          <select
            value={bpm}
            disabled={running}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="bg-background border border-border rounded px-2 py-1 text-foreground disabled:opacity-50"
          >
            {[60, 75, 90].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5" role="list" aria-label={labels.standalone}>
        {chart.map((chord, i) => {
          const barNum = i + 1;
          const isActive = !isCountIn && position?.bar === barNum;
          return (
            <div
              key={i}
              role="listitem"
              className={`rounded-md border px-2 py-3 text-center text-sm transition-colors ${
                isActive ? `border-gold bg-gold/20 text-gold ${reducedMotion ? "" : "scale-105"}` : "border-border text-muted-foreground"
              }`}
            >
              <div className="text-[10px] opacity-60">{labels.bar} {barNum}</div>
              <div className="font-display text-base">{chord}</div>
            </div>
          );
        })}
      </div>
      {isCountIn && (
        <p className="mt-2 text-xs text-gold">{labels.beat} {(position?.beat ?? 0) + 1} / 4</p>
      )}
    </div>
  );
}
