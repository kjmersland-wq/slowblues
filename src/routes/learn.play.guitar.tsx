import { createFileRoute } from "@tanstack/react-router";
import { LearnPlayTrackPage } from "@/components/learn/LearnPlayTrackPage";

export const Route = createFileRoute("/learn/play/guitar")({
  component: () => <LearnPlayTrackPage trackId="guitar" />,
  head: () => ({
    meta: [
      { title: "Learn Blues Guitar — 5 Beginner Lessons | SlowBlues" },
      { name: "description", content: "From your first hold to a slow 12-bar, a shuffle and your first taste of slide — five short, honest blues guitar lessons for absolute beginners." },
      { property: "og:title", content: "Learn Blues Guitar | SlowBlues" },
      { property: "og:description", content: "Five short blues guitar lessons for beginners — real technique, no theory overload." },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/learn/play/guitar" }],
  }),
});
