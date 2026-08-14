import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { fetchMerchCollection, type MerchProduct } from "@/lib/fourthwall.functions";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/about/merch/collection/$slug")({
  component: CollectionPage,
  head: ({ params }) => ({
    meta: [
      { title: `${prettify(params.slug)} Collection — SlowBlues Merch` },
      { name: "description", content: `Browse the ${prettify(params.slug)} collection — official SlowBlues apparel and prints.` },
      { property: "og:title", content: `${prettify(params.slug)} — SlowBlues Merch` },
      { property: "og:url", content: `https://www.slow-blues.com/about/merch/collection/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `https://www.slow-blues.com/about/merch/collection/${params.slug}` }],
  }),
});

export function prettify(slug: string) {
  return slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
}
function formatPrice(p: MerchProduct["price"]) {
  if (!p) return "";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.value); }
  catch { return `${p.value} ${p.currency}`; }
}

function CollectionPage() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();
  const fetcher = useServerFn(fetchMerchCollection);
  const { data, isLoading } = useQuery({
    queryKey: ["merch-collection", slug],
    queryFn: () => fetcher({ data: { slug } }),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link to="/about/merch" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-8">
          <ArrowLeft className="size-4" /> {tr(lang, { no: "Tilbake til butikken", en: "Back to shop", sv: "Tillbaka till butiken", de: "Zurück zum Shop", pl: "Powrót do sklepu" })}
        </Link>

        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
          {tr(lang, { no: "Kolleksjon", en: "Collection", sv: "Kollektion", de: "Kollektion", pl: "Kolekcja" })}
        </div>
        <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">
          {data?.collection?.name ?? prettify(slug)}
        </h1>
        {data?.collection?.description && (
          <p className="text-foreground/80 max-w-2xl mb-10">{data.collection.description}</p>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" /> {tr(lang, { no: "Laster kolleksjon …", en: "Loading collection…", sv: "Läser in kollektion …", de: "Kollektion wird geladen …", pl: "Wczytywanie kolekcji…" })}
          </div>
        )}

        {data && data.products.length === 0 && !isLoading && (
          <p className="text-muted-foreground">
            {tr(lang, {
              no: "Ingen produkter i denne kolleksjonen akkurat nå.",
              en: "No products in this collection right now.",
              sv: "Inga produkter i den här kollektionen just nu.",
              de: "Momentan keine Produkte in dieser Kollektion.",
              pl: "Obecnie brak produktów w tej kolekcji.",
            })}
          </p>
        )}

        {data && data.products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {data.products.map((p) => (
              <Link key={p.id} to="/about/merch/$slug" params={{ slug: p.slug }} className="group block bg-card/40 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition">
                <div className="aspect-square bg-muted/30 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag className="size-8" /></div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg leading-tight mb-1 group-hover:text-gold transition">{p.name}</h3>
                  <span className="text-sm text-foreground/80">{formatPrice(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
