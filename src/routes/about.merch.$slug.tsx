import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { ShoppingBag, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { fetchMerchProduct, type MerchProduct } from "@/lib/fourthwall.functions";

export const Route = createFileRoute("/about/merch/$slug")({
  component: ProductPage,
  head: ({ params }) => ({
    meta: [
      { title: `${prettify(params.slug)} — SlowBlues Merch` },
      { name: "description", content: `Official SlowBlues merch — ${prettify(params.slug)}. Premium print-on-demand, shipped worldwide.` },
      { property: "og:type", content: "product" },
      { property: "og:title", content: `${prettify(params.slug)} — SlowBlues Merch` },
      { property: "og:url", content: `https://sslow-blues.lovable.app/about/merch/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `https://sslow-blues.lovable.app/about/merch/${params.slug}` }],
  }),
  errorComponent: () => <PageShell><div className="max-w-3xl mx-auto px-6 py-20 text-center text-muted-foreground">Couldn't load this product.</div></PageShell>,
  notFoundComponent: () => <PageShell><div className="max-w-3xl mx-auto px-6 py-20 text-center"><p className="text-muted-foreground">Product not found.</p><Link to="/about/merch" className="text-gold underline mt-4 inline-block">Back to shop</Link></div></PageShell>,
});

function prettify(slug: string) {
  return slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
}

function formatPrice(p: MerchProduct["price"]) {
  if (!p) return "";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.value); }
  catch { return `${p.value} ${p.currency}`; }
}

function ProductPage() {
  const { slug } = Route.useParams();
  const fetcher = useServerFn(fetchMerchProduct);
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["merch-product", slug],
    queryFn: () => fetcher({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });
  const [active, setActive] = useState(0);

  if (isLoading) return <PageShell><div className="flex items-center justify-center py-32 text-muted-foreground"><Loader2 className="size-5 animate-spin mr-2" />Loading…</div></PageShell>;

  if (!data?.product) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground mb-4">This product isn't available right now.</p>
          <Link to="/about/merch" className="text-gold underline">← Back to shop</Link>
        </div>
      </PageShell>
    );
  }

  const p = data.product;
  const images = p.images.length ? p.images : (p.image ? [p.image] : []);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: images,
    offers: p.price ? {
      "@type": "Offer",
      url: p.shopUrl,
      priceCurrency: p.price.currency,
      price: p.price.value,
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    } : undefined,
  };

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button onClick={() => router.history.back()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-8">
          <ArrowLeft className="size-4" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square bg-muted/30 rounded-xl overflow-hidden border border-border">
              {images[active] ? (
                <img src={images[active]} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag className="size-10" /></div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button key={src} onClick={() => setActive(i)} className={`flex-shrink-0 size-20 rounded-lg overflow-hidden border-2 transition ${i === active ? "border-gold" : "border-border opacity-70 hover:opacity-100"}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">SlowBlues Merch</div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">{p.name}</h1>
            <div className="text-2xl text-foreground/90 mb-6">{formatPrice(p.price)}</div>

            {p.description && (
              <div className="prose prose-invert max-w-none text-foreground/80 leading-relaxed mb-8 whitespace-pre-line">{p.description}</div>
            )}

            <a
              href={p.shopUrl}
              target="_blank"
              rel="noopener"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
            >
              <ShoppingBag className="size-5" /> {p.inStock ? "Buy on Fourthwall" : "View on Fourthwall"}
              <ExternalLink className="size-4" />
            </a>
            <p className="text-xs text-muted-foreground mt-3">Secure checkout on Fourthwall. Shipping calculated at checkout.</p>
          </div>
        </div>

        {data.related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl mb-6">You may also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.related.map((r) => (
                <Link key={r.id} to="/about/merch/$slug" params={{ slug: r.slug }} className="group block bg-card/40 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition">
                  <div className="aspect-square bg-muted/30 overflow-hidden">
                    {r.image && <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base leading-tight mb-1 group-hover:text-gold transition">{r.name}</h3>
                    <span className="text-sm text-foreground/80">{formatPrice(r.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </PageShell>
  );
}
