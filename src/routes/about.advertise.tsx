import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdvertiseView } from "@/components/AdvertiseView";

export const Route = createFileRoute("/about/advertise")({
  component: () => (
    <PageShell>
      <AdvertiseView />
    </PageShell>
  ),
  head: () => ({
    meta: [
      { title: "Advertise & Partner — SlowBlues" },
      { name: "description", content: "Partner with SlowBlues — sponsored stories, festival features and co-branded merch reaching a global blues audience." },
      { property: "og:title", content: "Advertise & Partner — SlowBlues" },
      { property: "og:description", content: "Partner with SlowBlues — sponsored stories, festival features and co-branded merch." },
    ],
  }),
});
