import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale } from "@/lib/locale";
import { supportHead } from "@/lib/supportSeo";
import { SupportPage } from "./support";

// English lives unprefixed at /support (see routes/support.tsx); this serves /no, /sv, /de and /pl.
export const Route = createFileRoute("/$locale/support")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "en") throw notFound();
  },
  component: SupportPage,
  head: ({ params }) => supportHead(isLocale(params.locale) ? params.locale : "en"),
});
