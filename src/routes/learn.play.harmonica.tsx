import { createFileRoute } from "@tanstack/react-router";
import { LearnPlayTrackPage } from "@/components/learn/LearnPlayTrackPage";

export const Route = createFileRoute("/learn/play/harmonica")({
  component: () => <LearnPlayTrackPage trackId="harmonica" />,
  head: () => ({
    meta: [
      { title: "Learn Blues Harmonica — 5 Beginner Lessons | SlowBlues" },
      { name: "description", content: "From your first seal to your first bend, all on a C harp — five short, honest blues harmonica lessons for absolute beginners." },
      { property: "og:title", content: "Learn Blues Harmonica | SlowBlues" },
      { property: "og:description", content: "Five short blues harmonica lessons for beginners — real technique, no theory overload." },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/learn/play/harmonica" }],
  }),
});
