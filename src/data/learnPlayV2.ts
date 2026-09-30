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
import { buildChart, type ChordChart } from "@/components/learn/TwelveBarCounter";
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

const A_CHART: ChordChart = buildChart("A7", "D7", "E7");

export const G2_SLOW_12BAR: StepLesson = {
  id: "guitar-2",
  instrument: "guitar",
  order: 2,
  title: "The Slow 12-Bar",
  artistSlug: "muddy-waters",
  steps: [
    { kind: "goal", text: "You'll play a full slow 12-bar in A7-D7-E7 without losing the form." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "rLm99QI8eWs", credit: "JustinGuitar", verified: true },
      caption: "12-bar blues for beginners, start to finish.",
    },
    {
      kind: "understand",
      text: "You already know A7 and D7. E7 is the new one — the \"away\" chord that wants to come back home. The form is the same 12 bars you counted in Ears First, now with real chords under it: A7 for four bars, D7 for two, back to A7 for two, then E7-D7-A7-E7 to finish — that last stretch is called the turnaround, and it's what tells your ear \"round we go again.\"",
    },
    {
      kind: "try",
      items: [
        { goal: "Add E7.", technique: "Place the E7 shape and strum it a few times on its own.", workingSign: "It rings clean, same as A7 and D7 already do." },
        { goal: "Slow-motion changes.", technique: "Go A7 → D7 → E7 → A7, one strum each, no rush, in any order to start.", workingSign: "Your fingers find each shape without you looking down." },
        { goal: "The form, bar by bar.", technique: "Now play it in order: A7 (4 bars) → D7 (2) → A7 (2) → E7-D7-A7-E7 (the turnaround).", workingSign: "You land on bar 1 again right as you finish bar 12." },
        { goal: "Just the turnaround.", technique: "Loop only the last 4 bars — E7, D7, A7, E7 — a few times on its own.", workingSign: "It feels like a question that answers itself." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Play the full 12 bars once through without stopping.",
        "Land every chord change on the beat, not just close to it.",
        "Recognize the turnaround by ear when you hear it in a song.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "I rush into the chord change and mistime it.", fix: "Say the bar number out loud as you change — \"5\" the moment you move to D7. The word forces the timing." },
        { problem: "E7 sounds muddy or doesn't ring.", fix: "Check your first finger isn't accidentally touching the high e string — it should stay open." },
      ],
    },
    {
      kind: "play",
      task: "Play the full 12-bar, slow, no rush — this is the whole form for the first time with real chords.",
      chart: A_CHART,
      media: { kind: "video", videoId: "sQGcIWF29t4", credit: "Cliff Smith Backing Tracks", verified: true },
      caption: "Backing in A, 60 BPM.",
    },
    { kind: "record", prompt: "Record one full pass through the 12 bars. Listen back — where did the turnaround land?" },
  ],
};

export const G3_SHUFFLE: StepLesson = {
  id: "guitar-3",
  instrument: "guitar",
  order: 3,
  title: "The Shuffle",
  artistSlug: "elmore-james",
  steps: [
    { kind: "goal", text: "You'll feel the shuffle bounce and keep it steady with a simple right-hand pattern." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "0TxlHjPK0yk", credit: "JustinGuitar", verified: true },
      caption: "The shuffle rhythm that most blues songs are built on.",
    },
    {
      kind: "understand",
      text: "Long-short, long-short — that's a shuffle, not four even beats. Play it low on the two bass strings for each chord (root and the note a fifth above), palm-muting lightly with the side of your picking hand to keep it tight rather than ringing wide open.",
    },
    {
      kind: "try",
      items: [
        { goal: "The bounce, alone.", technique: "Count \"1-and-2-and\" but hold the \"and\" a beat longer than the number — long-short.", workingSign: "It sounds like a limping walk, not a robot count." },
        { goal: "Palm mute.", technique: "Rest the side of your picking hand lightly on the strings near the bridge while you play.", workingSign: "The notes sound tight and punchy, not ringing and open." },
        { goal: "Two-string pattern on A7.", technique: "Play the shuffle bounce on just the low A and its fifth (E), on A7.", workingSign: "You can keep it going without watching your hand." },
        { goal: "Carry it into the form.", technique: "Play the same shuffle pattern under D7 and E7 too, following the form from lesson 2.", workingSign: "The bounce doesn't break when the chord changes." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Keep the shuffle bounce going for 30 seconds without it flattening out.",
        "Palm-mute consistently, not just some of the time.",
        "Carry the shuffle through all three chords without losing the form.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "It comes out even, not \"long-short\".", fix: "Try saying \"boom-ba, boom-ba\" out loud while you play — the \"ba\" is short and quick, right before the next \"boom\"." },
        { problem: "Palm muting kills the sound completely.", fix: "You're pressing too hard. Rest your hand lightly — it should dampen the ring, not choke the note." },
      ],
    },
    {
      kind: "play",
      task: "Play the shuffle through the full 12-bar form, slow and steady before you try to speed up.",
      chart: A_CHART,
      media: { kind: "video", videoId: "sQGcIWF29t4", credit: "Cliff Smith Backing Tracks", verified: true },
      caption: "Same backing as lesson 2 — the shuffle sits on top of this same tempo.",
    },
    { kind: "record", prompt: "Record 30 seconds of the shuffle. Does it still bounce at the end, or does it flatten out?" },
  ],
};

export const G4_FIRST_PHRASE: StepLesson = {
  id: "guitar-4",
  instrument: "guitar",
  order: 4,
  title: "Your First Phrase",
  artistSlug: "stevie-ray-vaughan",
  steps: [
    { kind: "goal", text: "You'll play two short licks from the A minor pentatonic scale and trade phrases with the track." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "Gu2esZ-PzFM", credit: "JustinGuitar", verified: true },
      caption: "Blues licks built from the same five notes you're about to learn.",
    },
    {
      kind: "understand",
      text: "The A minor pentatonic scale is just five notes, repeated — the box diagram below shows one shape of it. You don't need to play the whole scale up and down; two or three notes said with feeling beats a fast run every time. Call-and-response means: play a short phrase, then stop and leave space, like you're waiting for an answer.",
    },
    {
      kind: "try",
      items: [
        { goal: "Find the box.", technique: "Play through the five notes in the diagram below, slowly, one at a time.", workingSign: "You can find the root note (marked solid) without hunting for it." },
        { goal: "Lick one.", technique: "Play this 3-note phrase: root, up a string, back to root — let the last note ring.", workingSign: "It sounds like a short question, not a scale exercise." },
        { goal: "Lick two.", technique: "Play this 4-note phrase: one string down from root, root, up a string, root again.", workingSign: "It feels like an answer to lick one." },
        { goal: "Leave space.", technique: "Play a lick, then count two full bars of silence before playing the next one.", workingSign: "The silence feels intentional, not like you forgot what's next." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Play both licks cleanly without buzzing.",
        "Leave real silence between phrases instead of filling every gap.",
        "Play a lick in time with the form, not just whenever.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "My licks sound rushed or cramped.", fix: "Play half as many notes, twice as slow. A short phrase with room to breathe always sounds more confident." },
        { problem: "I lose track of where the root note is.", fix: "Mark it — a bit of tape on the fret, or just say \"home\" out loud each time you land on it, until it's automatic." },
      ],
    },
    {
      kind: "play",
      task: "Call-and-response: play a lick, leave space for two bars, let the track answer, then play again.",
      chart: A_CHART,
      media: { kind: "video", videoId: "sQGcIWF29t4", credit: "Cliff Smith Backing Tracks", verified: true },
      caption: "Backing in A — same track, now you're phrasing over it instead of just strumming.",
    },
    { kind: "record", prompt: "Record one minute of call-and-response. Listen back for the silences — are they as clear as the notes?" },
  ],
};

export const G5_SLIDE: StepLesson = {
  id: "guitar-5",
  instrument: "guitar",
  order: 5,
  title: "A Taste of Slide (optional)",
  artistSlug: "elmore-james",
  steps: [
    { kind: "goal", text: "Optional bonus: you'll get one clean, singing slide note on a single string." },
    {
      kind: "watch",
      media: { kind: "illustration", illustration: { kind: "slide-position" } },
      caption: "The slide rests just above the fret wire, not behind it like normal fretting. (No verified slide-technique video yet — see docs/media-candidates.md.)",
    },
    {
      kind: "understand",
      text: "This lesson is a bonus — skip it and come back anytime, the rest of the course doesn't depend on it. Put a slide on your ring or little finger, keeping your other fingers free to mute. Rest it lightly right over the fret wire, barely touching the string, and mute the strings behind the slide with your other fingers so they don't ring along by accident.",
    },
    {
      kind: "try",
      items: [
        { goal: "Position the slide.", technique: "Rest it light, right over the fret wire — not pressing down behind it like a normal chord.", workingSign: "You can move it smoothly without gripping the neck." },
        { goal: "Mute behind it.", technique: "Lightly touch the strings behind the slide with your other fingers.", workingSign: "You don't hear extra buzzy notes ringing alongside the slide note." },
        { goal: "One note, sustained.", technique: "Pick one string, hold the slide steady on one fret, and let the note ring.", workingSign: "It sings, rather than rattling or buzzing." },
        { goal: "One simple phrase.", technique: "Slide slowly from one fret up to the next and let it settle — one small phrase, nothing more.", workingSign: "The motion sounds smooth, not like two separate notes." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Get one clean, ringing note with the slide.",
        "Mute behind the slide well enough that other strings stay quiet.",
        "Play one small slide phrase without buzzing.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "It buzzes or rattles.", fix: "Too much downward pressure — a slide floats on top of the string, it doesn't press it to the fretboard like a finger does." },
        { problem: "Other strings ring along and it sounds messy.", fix: "That's muting, not slide technique — rest your other fingers lightly across the strings behind the slide." },
      ],
    },
    {
      kind: "play",
      task: "Slide slowly over the backing track — one note or one small phrase per bar, nothing more.",
      chart: undefined,
      media: { kind: "video", videoId: "sQGcIWF29t4", credit: "Cliff Smith Backing Tracks", verified: true },
      caption: "Same slow backing in A — plenty of room to let notes ring.",
    },
    { kind: "record", prompt: "Record 20 seconds of slide over the track. One clean note is a win — don't judge yourself against a full solo yet." },
  ],
};

export const H2_ONE_NOTE: StepLesson = {
  id: "harmonica-2",
  instrument: "harmonica",
  order: 2,
  title: "One Clean Note",
  artistSlug: "big-walter-horton",
  steps: [
    { kind: "goal", text: "You'll play one clean single note on request, not just a chord." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "9w8QYW5Wsh0", credit: "Tomlin Leckie", verified: true },
      caption: "Single notes, explained and demonstrated.",
    },
    {
      kind: "understand",
      text: "Lip pursing means shaping your mouth into a small, focused opening — like whistling — so only one hole gets air instead of three or four. Start on hole 4, the easiest to isolate, then try 3 and 5, then hole 2 on the draw. After each one, ask yourself honestly: do I hear one note, or several at once?",
    },
    {
      kind: "try",
      items: [
        { goal: "Pucker on hole 4.", technique: "Purse your lips small and aim the air at hole 4 alone, blow and draw.", workingSign: "You hear a single clear pitch each time, not a cluster." },
        { goal: "Move to hole 3, then 5.", technique: "Shift the same small embouchure one hole left, then two holes right.", workingSign: "Each one comes out clean without you widening your mouth." },
        { goal: "Hole 2, draw only.", technique: "Aim the same small opening at hole 2 and draw gently.", workingSign: "One note, not a chord — this is the hole you'll use most in the next lesson." },
        { goal: "Tone check.", technique: "After each hole, ask out loud: \"one note, or a chord?\"", workingSign: "You can tell the difference without a teacher confirming it for you." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Get a clean single note on hole 4, both blow and draw.",
        "Repeat that on holes 3 and 5.",
        "Get a clean single note on hole 2, draw.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "I still hear more than one note.", fix: "Your mouth opening is too wide. Make the \"whistle\" shape smaller and aim more precisely." },
        { problem: "The note cuts out or sounds strangled.", fix: "You're pressing too hard against the harp. Back off the pressure — a light seal, not a tight one." },
      ],
    },
    {
      kind: "play",
      task: "Practice single notes on holes 2, 3, 4 and 5 along with the backing, one clean note per bar.",
      media: { kind: "video", videoId: "NP7XefeRXSM", credit: "Tomlin Leckie", verified: true },
      caption: "Backing in G, slow — a different track from lesson 1, same key.",
    },
    { kind: "record", prompt: "Record yourself playing single notes on holes 2 through 5, one at a time. Listen back — which one is cleanest?" },
  ],
};

export const H3_CROSS_HARP: StepLesson = {
  id: "harmonica-3",
  instrument: "harmonica",
  order: 3,
  title: "Cross Harp",
  artistSlug: "little-walter",
  steps: [
    { kind: "goal", text: "You'll understand why blues players use a C harp in the \"wrong\" key on purpose, and find home on hole 2 draw." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "ZGHE1NhFYhU", credit: "LearnTheHarmonica.com", verified: true },
      caption: "What 2nd position (cross harp) actually means.",
    },
    {
      kind: "understand",
      text: "A C harmonica, played straight, gives you the key of C. Played cross harp — 2nd position — it actually gives you the blues in G, which is why the backing tracks in this course are all in G. Home base is hole 2 on the draw. Everything else is either \"home\" or \"away\" from that one note, the same home/away feeling from Ears First.",
    },
    {
      kind: "try",
      items: [
        { goal: "Find home.", technique: "Draw on hole 2, slowly and clearly, several times in a row.", workingSign: "It feels settled — like the end of a sentence, not the middle." },
        { goal: "One step away.", technique: "Blow on hole 2, then draw again — notice the difference in feeling.", workingSign: "The blow note feels like it wants to move, the draw feels like home." },
        { goal: "Home and away, sparse.", technique: "Alternate draw-2 (home) and blow-3 (away), slowly, with space between.", workingSign: "You can hear which one is \"home\" without having to think about it." },
        { goal: "Play over the track.", technique: "With the backing playing, land on draw-2 whenever you feel unsure what to play.", workingSign: "It always sounds right, because it's the home note." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Find hole 2 draw without hunting for it.",
        "Tell by ear whether a note feels like \"home\" or \"away\".",
        "Play a few sparse notes over the backing without it sounding random.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "I can't hear a difference between notes.", fix: "Don't judge every note — just compare hole 2 draw against anything else, back and forth, a few times. The contrast is what teaches your ear." },
        { problem: "I feel like I have to play constantly.", fix: "You don't. Playing three notes and going quiet for four bars is not just okay here — it's the point. Sparse is the goal, not a fallback." },
      ],
    },
    {
      kind: "play",
      task: "Play sparse — a note, then space, then another note — always coming back to draw-2 as home.",
      media: { kind: "video", videoId: "TEQ5Cp3nr_E", credit: "Tomlin Leckie", verified: true },
      caption: "A slow 12-bar built for C harp, cross harp in G.",
    },
    { kind: "record", prompt: "Record one minute of sparse playing. Count how many times you landed on draw-2 — was it more than half?" },
  ],
};

export const H4_ONE_RIFF: StepLesson = {
  id: "harmonica-4",
  instrument: "harmonica",
  order: 4,
  title: "One 12-Bar Riff",
  artistSlug: "little-walter",
  steps: [
    { kind: "goal", text: "You'll play one small, repeatable riff — no bending needed — that carries across the whole 12-bar." },
    {
      kind: "watch",
      media: { kind: "video", videoId: "TEQ5Cp3nr_E", credit: "Tomlin Leckie", verified: true },
      caption: "The same slow 12-bar lesson from last time — listen again for how a small phrase repeats.",
    },
    {
      kind: "understand",
      text: "Here's a tiny original riff, no bending required: draw 2, blow 2, draw 3, draw 2. Four notes, about two seconds, entirely on holes 2 and 3. For rhythm underneath it, \"chord chugging\" just means a short, muted chord-breath on the off-beats — think of it as the harmonica's version of the guitar's palm-muted shuffle from earlier.",
    },
    {
      kind: "try",
      items: [
        { goal: "Learn the riff, slow.", technique: "Draw 2, blow 2, draw 3, draw 2 — one note at a time, no rush.", workingSign: "Each note is clean before you move to the next." },
        { goal: "Loop it evenly.", technique: "Repeat the riff on a steady pulse until it feels boring.", workingSign: "Boring means it's ready — you're not thinking about the notes anymore." },
        { goal: "Chord chug for rhythm.", technique: "Between riff repeats, add a short, muted chord-breath — a quick chuff on holes 1-2-3 together.", workingSign: "It fills the gap without stepping on the riff." },
        { goal: "Carry it across the form.", technique: "Play the riff through a full 12-bar, repeating it every bar or two.", workingSign: "It still feels like \"home\" even without changing what you're playing." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Play the riff cleanly, evenly, without rushing.",
        "Add a chord chug between repeats without it feeling clumsy.",
        "Carry the riff through a full 12-bar backing.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "The riff comes out uneven.", fix: "Slow it down further than feels necessary, and count \"1-2-3-4\" under it until the timing is automatic." },
        { problem: "The chord chug drowns out the riff.", fix: "Make it shorter and quieter — it's a rhythmic accent, not a second riff competing for attention." },
      ],
    },
    {
      kind: "play",
      task: "Loop the riff over the full 12-bar backing, adding the chord chug between repeats once it feels solid.",
      media: { kind: "video", videoId: "-5yMMo-uDbE", credit: "LearnTheHarmonica.com", verified: true },
      caption: "Backing in G, quick-change — same track as lesson 1.",
    },
    { kind: "record", prompt: "Record one full pass of the riff over the backing. Does it still sit \"home\" by the last bar?" },
  ],
};

export const H5_FIRST_BEND: StepLesson = {
  id: "harmonica-5",
  instrument: "harmonica",
  order: 5,
  title: "Your First Bend",
  artistSlug: "big-walter-horton",
  steps: [
    { kind: "goal", text: "You'll get the concept of a draw bend on hole 4, the easiest to learn, then try hole 2." },
    {
      kind: "watch",
      media: { kind: "illustration", illustration: { kind: "harp", highlight: [4], direction: "draw" } },
      caption: "Hole 4 draw — the easiest bend to learn on the whole harp. (No verified bending-technique video yet — see docs/media-candidates.md.)",
    },
    {
      kind: "understand",
      text: "Bending is shaping the inside of your mouth to pull the pitch down while you draw. Say \"eee\" out loud, then slide toward \"aww\" while drawing on hole 4 — you're aiming your tongue and jaw down and back, not blowing or drawing harder. Be honest with yourself: bending takes weeks, and everyone sounds like a sad duck at first. That's completely normal, and it's exactly where every great player started.",
    },
    {
      kind: "try",
      items: [
        { goal: "Draw hole 4, straight.", technique: "Get a clean, unbent draw note on hole 4 first — your reference pitch.", workingSign: "It's steady and clear before you try to change it." },
        { goal: "Shape \"eee\" to \"aww\".", technique: "Say both sounds out loud a few times, feeling your tongue move, before you try it on the harp.", workingSign: "You can feel your tongue and jaw shift position without a harp in your mouth." },
        { goal: "Bend hole 4.", technique: "Draw hole 4 and slide your mouth shape from \"eee\" toward \"aww\" mid-note.", workingSign: "The pitch dips down, even a little — any dip counts as a first bend." },
        { goal: "Try hole 2.", technique: "Only once hole 4 feels familiar, try the same motion on hole 2 draw.", workingSign: "You get some pitch movement, even if it's small or inconsistent." },
      ],
    },
    {
      kind: "check",
      criteria: [
        "Get a clean, unbent reference note on hole 4 draw.",
        "Hear any downward pitch movement at all when you try to bend it.",
        "Try the same motion on hole 2, even without full control yet.",
      ],
    },
    {
      kind: "fix",
      problems: [
        { problem: "Nothing happens — the pitch doesn't move.", fix: "You're probably still blowing/drawing harder instead of reshaping your mouth. Go back to just saying \"eee-aww\" out loud until the tongue motion is automatic, then bring the harp back in." },
        { problem: "The note just stops instead of bending.", fix: "You're closing off airflow, not reshaping it. Keep the air moving steadily and only change the shape inside your mouth." },
      ],
    },
    {
      kind: "play",
      task: "Try bending hole 4 over the backing track, a few attempts per pass — this is exploration, not performance.",
      media: { kind: "video", videoId: "NP7XefeRXSM", credit: "Tomlin Leckie", verified: true },
      caption: "Backing in G, slow — plenty of room to experiment without rushing.",
    },
    { kind: "record", prompt: "Record two minutes of bend attempts. Don't judge it yet — just notice if any single attempt moved more than the others." },
  ],
};

export const ALL_LESSONS: StepLesson[] = [
  L0_EARS,
  G1_HOLD, G2_SLOW_12BAR, G3_SHUFFLE, G4_FIRST_PHRASE, G5_SLIDE,
  H1_HOLD, H2_ONE_NOTE, H3_CROSS_HARP, H4_ONE_RIFF, H5_FIRST_BEND,
];
