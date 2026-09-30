// Learn to Play, Phase 1 vertical slice: L0 (shared), G1, H1.
// English only this phase — Phase 3 will wrap every string field below in
// the same LangText pattern used elsewhere on the site (see learnPlay.ts)
// and transcreate per locale. Nothing here is machine-translated or left
// blank; it's simply not translated *yet*, by design, per the phased
// delivery the brief itself asked for.
//
// Key standard for this phase (confirmed with the site owner over the
// previous E/A-harp standard): guitar in A (A7-D7-E7 open shapes),
// harmonica as a C harp playing cross harp in G. Lessons G2-G5/H2-H5 have
// NOT been migrated yet (Phase 2) and still reflect the previous E/A-harp
// standard on the live site — see docs/media-candidates.md for the
// temporary-inconsistency note this creates until Phase 2 ships.
import type { ChordChart } from "@/components/learn/TwelveBarCounter";
import type { IllustrationV2 } from "@/components/learn/IllustrationV2";

export type TryItem = { goal: string; technique: string; workingSign: string };
export type FixItem = { problem: string; fix: string };

export type WatchMedia =
  | { kind: "video"; videoId: string; start?: number; end?: number; credit: string; verified: true; loopable?: boolean }
  | { kind: "illustration"; illustration: IllustrationV2 };

export type StepCard =
  | { kind: "goal"; text: string }
  | { kind: "watch"; media: WatchMedia; caption: string }
  | { kind: "understand"; text: string }
  | { kind: "try"; items: TryItem[] }
  | { kind: "check"; criteria: string[] }
  | { kind: "fix"; problems: FixItem[] }
  | { kind: "play"; task: string; chart?: ChordChart; media?: WatchMedia; caption?: string }
  | { kind: "record"; prompt: string };

export type RewardItem = { videoId: string; credit: string; caption: string; artistSlug: string };

export type StepLesson = {
  id: string;
  instrument: "shared" | "guitar" | "harmonica";
  order: number;
  title: string;
  artistSlug?: string;
  needsExpertReview?: string[];
  steps: StepCard[];
  reward?: RewardItem[]; // "Later / where this leads" — never the first example
};

export const L0_EARS: StepLesson = {
  id: "ears",
  instrument: "shared",
  order: 0,
  title: "Ears First",
  artistSlug: "charley-patton",
  steps: [
    { kind: "goal", text: "You'll feel the 12-bar blues form in your body, before you touch an instrument." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "sQGcIWF29t4", credit: "Cliff Smith Backing Tracks", verified: true },
      caption: "This is the same track you'll count along to in a minute — get to know it first.",
    },
    {
      kind: "understand",
      text: "A 12-bar blues has three chord \"colors\": home, away, and tension — home is where you start and end, away lifts you up, tension wants to resolve back home. You don't need the music-theory names for them. Just notice when the sound shifts, and let the very last note of the whole thing ring out before it starts again.",
    },
    {
      kind: "try",
      items: [
        { goal: "Feel the pulse.", technique: "Tap your foot along with a slow, steady beat.", workingSign: "Your foot lands in the same spot every time, without you thinking about it." },
        { goal: "Count to 4.", technique: "Say \"1-2-3-4\" out loud on every pulse.", workingSign: "The numbers land exactly on your foot-taps." },
        { goal: "Count bars 1 to 12.", technique: "Now count whole bars instead of beats: \"1\", then \"2\", up to \"12\", then back to \"1\".", workingSign: "You land back on \"1\" right as the music does." },
        { goal: "Raise a hand at each color change.", technique: "Lift a hand the moment the sound shifts — home, away, tension, home.", workingSign: "Your hand goes up in the same two spots every time through." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Count 12 without losing your place, two times in a row.",
        "Point to (or say out loud) the two moments where the sound changes.",
        "Let the very last note ring before starting over.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "I lose count around bar 7 or 8.", fix: "That's the most common spot — the chords move faster there. Go back to just tapping your foot through that stretch, no counting, until it feels steady." },
        { problem: "I can't hear where the sound \"changes\".", fix: "Don't worry about naming it. Just notice: does this next bit feel like home, or like it's going somewhere? That's enough for now." },
      ],
    },
    {
      kind: "play",
      task: "This time, just count — out loud or in your head. Don't play anything yet.",
      chart: undefined,
      media: { kind: "video", videoId: "sQGcIWF29t4", credit: "Cliff Smith Backing Tracks", verified: true },
      caption: "Same recording as before — now you're counting along with the actual music instead of a click.",
    },
    { kind: "record", prompt: "Record 30 seconds of yourself counting along, out loud, to any 12-bar song. Play it back. Notice one thing you got right." },
  ],
  reward: [
    {
      videoId: "i0hVIrQm0KM",
      credit: "Stevie Ray Vaughan",
      caption: "Later / where this leads: Stevie Ray Vaughan, live. This is not today's lesson — just a glimpse of where the 12-bar form can go.",
      artistSlug: "stevie-ray-vaughan",
    },
    {
      videoId: "Q5gTmNKrj9s",
      credit: "Jimmy Reed",
      caption: "Later / where this leads: Jimmy Reed's \"Bright Lights, Big City\" — a different, more laid-back way the same 12 bars can feel.",
      artistSlug: "jimmy-reed",
    },
  ],
};

export const G1_HOLD: StepLesson = {
  id: "guitar-1",
  instrument: "guitar",
  order: 1,
  title: "Hold It and First Shapes",
  artistSlug: "robert-johnson",
  steps: [
    { kind: "goal", text: "You'll hold the guitar comfortably, get it roughly in tune, and switch cleanly between A7 and D7." },
    {
      kind: "watch",
      media: { kind: "illustration", illustration: { kind: "hold-guitar" } },
      caption: "Body against your stomach, neck angled up a little — not flat, not pointing at the ceiling. (No verified hold/tuning video yet — see docs/media-candidates.md.)",
    },
    {
      kind: "understand",
      text: "Sit with the guitar resting against you, not balanced on your knee. Tune by matching each string to a reference tone, one at a time — your ear gets faster at this with practice. Hold the pick loosely between thumb and first finger; a death grip makes everything harder. Your fretting fingers press just behind the fret wire, not on top of it.",
    },
    {
      kind: "try",
      items: [
        { goal: "Sit and hold.", technique: "Guitar body against your stomach, neck up a little.", workingSign: "You can let go with both hands and it doesn't slide." },
        { goal: "Tune by ear.", technique: "Use the reference tones below, matching each string one at a time.", workingSign: "The string stops sounding \"wobbly\" against the tone." },
        { goal: "Play one open string in time.", technique: "Pick the low A string once per foot-tap, nice and even.", workingSign: "You're not rushing or dragging against your own foot." },
        { goal: "Shape A7, then D7.", technique: "Place your fingers for A7, strum, then move to D7 and strum.", workingSign: "Both chords ring clean, no buzzing strings." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Hold the guitar without using your hands to keep it in place.",
        "Get all 6 strings roughly in tune using the reference tones.",
        "Switch A7 → D7 → A7 without stopping to think about where your fingers go.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "A string buzzes or sounds dead.", fix: "That finger isn't close enough to the fret wire, or it's leaning on the string next to it. Move it right up against the fret and check its neighbors." },
        { problem: "The chord change takes too long.", fix: "Slow it down more than feels necessary. Speed comes from repetition, not from rushing now." },
      ],
    },
    {
      kind: "play",
      task: "Switch A7 to D7 on your own time, counting bars 1 to 4 out loud as you go — no track yet, this lesson is about the shapes. The full 12-bar form is next lesson.",
    },
    { kind: "record", prompt: "Record yourself switching A7 to D7, four times through. Listen back — does the second chord ring as clean as the first?" },
  ],
};

export const H1_HOLD: StepLesson = {
  id: "harmonica-1",
  instrument: "harmonica",
  order: 1,
  title: "Hold and Seal",
  artistSlug: "little-walter",
  steps: [
    { kind: "goal", text: "You'll hold a C harmonica correctly, get a clean seal, and play the \"train rhythm\" over holes 1-3." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "1XiuD2SFaV8", credit: "Adam Gussow", verified: true },
      caption: "A real first lesson, start to finish — watch the hold and the mouth position.",
    },
    {
      kind: "understand",
      text: "Cup the harp in one hand, numbers up, low notes to your left. Bring the harmonica to your mouth — not your head down to the harp. Lips soft, like you're about to say \"ooh\". Now breathe gently in and out, like a sigh. That's it. You're already playing.",
    },
    {
      kind: "try",
      items: [
        { goal: "Hold it right.", technique: "Numbers up, low notes left, cup it loosely in one hand.", workingSign: "It doesn't wobble in your hand." },
        { goal: "Bring it to your mouth.", technique: "Move the harp to you, not your head down to it.", workingSign: "Your neck feels relaxed, not craned forward." },
        { goal: "Soft seal.", technique: "Lips loose around about 3 holes, like starting to say \"ooh\".", workingSign: "You're not straining your cheeks or lips." },
        { goal: "Breathe the train rhythm.", technique: "Gentle in, gentle out, over holes 1-2-3 — \"nucka-tucka\".", workingSign: "You hear a steady chugging sound, not separate honks." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Hold the harp steady without gripping it hard.",
        "Get a soft seal without straining your lips.",
        "Breathe the train rhythm for 8 breaths without stopping.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "It sounds thin or squeaky.", fix: "You're probably sealing too tight. Loosen your lips — say \"ooh\" a little bigger." },
        { problem: "My cheeks or jaw hurt after a minute.", fix: "You're holding tension you don't need. Drop your jaw, relax your shoulders, and try again slower." },
      ],
    },
    {
      kind: "play",
      task: "Breathe the train rhythm over holes 1-3, in time with the backing track. Tap the holes below to hear each note on its own first.",
      media: { kind: "video", videoId: "-5yMMo-uDbE", credit: "LearnTheHarmonica.com", verified: true },
      caption: "Backing in G, quick-change — cross harp on a C harmonica.",
    },
    { kind: "record", prompt: "Record 20 seconds of your train rhythm. Play it back — is it steady, or does it speed up?" },
  ],
};
