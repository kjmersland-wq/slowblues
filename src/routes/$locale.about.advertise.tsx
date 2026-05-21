import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AdvertiseView } from "@/components/AdvertiseView";
import { isLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/about/advertise")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "no") throw notFound();
  },
  component: () => (
    <PageShell>
      <AdvertiseView />
    </PageShell>
  ),
  head: () => ({
    meta: [
      { title: "Advertise & Partner — SlowBlues" },
      { name: "description", content: "Partner with SlowBlues — reach a global blues audience." },
    ],
  }),
});
