import { createFileRoute } from "@tanstack/react-router";
import { LearnPlayTrackPage } from "@/components/learn/LearnPlayTrackPage";

export const Route = createFileRoute("/learn/play/guitar")({
  component: () => <LearnPlayTrackPage trackId="guitar" />,
  head: () => ({
    meta: [
      { title: "Learn Blues Guitar — Beginner Lessons | SlowBlues" },
      { name: "description", content: "How to play blues guitar from zero: chords, the 12-bar, shuffle rhythm, hammer-ons, bending, vibrato, slide and your first blues phrase — short, honest lessons for absolute beginners." },
      { property: "og:title", content: "Learn Blues Guitar | SlowBlues" },
      { property: "og:description", content: "Blues guitar lessons for beginners — real technique, from your first chord to your first blues phrase." },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/learn/play/guitar" }],
  }),
});
