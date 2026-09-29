import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { BluesOrganisationsView } from "@/components/BluesOrganisationsView";

export const Route = createFileRoute("/about/blues-organisations")({
  component: () => (
    <PageShell>
      <BluesOrganisationsView />
    </PageShell>
  ),
  head: () => ({
    meta: [
      { title: "The Clubs and Unions Behind the Blues — SlowBlues" },
      { name: "description", content: "The people behind the music — Norsk Bluesunion, Swedish Blues Association, BluesDanmark, European Blues Union and The Blues Foundation, and what each one actually does." },
      { property: "og:title", content: "The Clubs and Unions Behind the Blues — SlowBlues" },
      { property: "og:description", content: "The people behind the music — the clubs, unions and foundations that keep the blues scene running." },
      { property: "og:url", content: "https://www.slow-blues.com/about/blues-organisations" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/about/blues-organisations" }],
  }),
});
