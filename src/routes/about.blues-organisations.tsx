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
      { title: "Blues Organisations — SlowBlues" },
      { name: "description", content: "The clubs, unions and foundations that keep the blues scene running — Norsk Bluesunion, Swedish Blues Association, BluesDanmark, European Blues Union and The Blues Foundation." },
      { property: "og:title", content: "Blues Organisations — SlowBlues" },
      { property: "og:description", content: "The clubs, unions and foundations that keep the blues scene running." },
      { property: "og:url", content: "https://www.slow-blues.com/about/blues-organisations" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/about/blues-organisations" }],
  }),
});
