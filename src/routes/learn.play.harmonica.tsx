import { createFileRoute } from "@tanstack/react-router";
import { LearnPlayTrackPage } from "@/components/learn/LearnPlayTrackPage";

export const Route = createFileRoute("/learn/play/harmonica")({
  component: () => <LearnPlayTrackPage trackId="harmonica" />,
  head: () => ({
    meta: [
      { title: "Learn Blues Harmonica — Beginner Lessons | SlowBlues" },
      { name: "description", content: "How to play blues harmonica from zero: single notes, cross harp, riffs, bending, vibrato and tone, all on an A harp, up to your first blues phrase — short, honest lessons for absolute beginners." },
      { property: "og:title", content: "Learn Blues Harmonica | SlowBlues" },
      { property: "og:description", content: "Blues harmonica lessons for beginners — real technique, from your first note to your first blues phrase." },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/learn/play/harmonica" }],
  }),
});
