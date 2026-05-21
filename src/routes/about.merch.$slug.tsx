import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { ShoppingBag, ExternalLink, Loader2, ArrowLeft, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { fetchMerchProduct, type MerchProduct, type MerchVariant } from "@/lib/fourthwall.functions";

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
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
  const [active, setActive] = useState(0);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  const p = data?.product;

  const selectedVariant: MerchVariant | null = useMemo(() => {
    if (!p) return null;
    if (!p.variants.length) return null;
    const matches = p.variants.filter((v) => {
      if (color && v.color?.name !== color) return false;
      if (size && v.size !== size) return false;
      return true;
    });
    return matches[0] ?? p.variants[0];
  }, [p, color, size]);

  if (isLoading) return <PageShell><div className="flex items-center justify-center py-32 text-muted-foreground"><Loader2 className="size-5 animate-spin mr-2" />Loading…</div></PageShell>;

  if (!p) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground mb-4">This product isn't available right now.</p>
          <Link to="/about/merch" className="text-gold underline">← Back to shop</Link>
        </div>
      </PageShell>
    );
  }

  const images = p.images.length ? p.images : (p.image ? [p.image] : []);
  const displayPrice = selectedVariant?.price ?? p.price;
  const priceLabel = displayPrice
    ? (p.priceMax && !selectedVariant?.price
        ? `${formatPrice(p.price)} – ${formatPrice(p.priceMax)}`
        : formatPrice(displayPrice))
    : "";
  const buyUrl = selectedVariant
    ? `${p.shopUrl}?variant=${encodeURIComponent(selectedVariant.id)}`
    : p.shopUrl;

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
        <Link
          to="/about/merch"
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-gold/40 bg-card/40 text-gold hover:bg-gold/10 hover:border-gold transition text-sm font-medium"
        >
          <ArrowLeft className="size-4" /> Tilbake til butikken
        </Link>


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
            <div className="text-2xl text-foreground/90 mb-6 flex items-baseline gap-3">
              {priceLabel}
              {selectedVariant?.compareAt && (
                <span className="text-base line-through text-muted-foreground">{formatPrice(selectedVariant.compareAt)}</span>
              )}
            </div>

            {p.colors.length > 0 && (
              <div className="mb-5">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Color{color ? `: ${color}` : ""}
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.colors.map((c) => {
                    const selected = color === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setColor(selected ? null : c.name)}
                        title={c.name}
                        className={`relative size-9 rounded-full border-2 transition ${selected ? "border-gold scale-110" : "border-border hover:border-foreground/40"}`}
                        style={{ background: c.swatch ?? "transparent" }}
                      >
                        {selected && <Check className="size-4 absolute inset-0 m-auto text-white drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {p.sizes.length > 0 && (
              <div className="mb-6">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Size{size ? `: ${size}` : ""}
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((s) => {
                    const selected = size === s;
                    const onlyOne = p.sizes.length === 1;
                    return (
                      <button
                        key={s}
                        onClick={() => !onlyOne && setSize(selected ? null : s)}
                        disabled={onlyOne}
                        className={`px-3 py-1.5 rounded-md border text-sm transition ${selected || onlyOne ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-foreground/40"} ${onlyOne ? "cursor-default" : ""}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedVariant && (
              <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${selectedVariant.inStock ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-destructive/30 text-destructive bg-destructive/10"}`}>
                  {selectedVariant.inStock ? "In stock" : "Sold out"}
                </span>
                {selectedVariant.sku && (
                  <span className="text-muted-foreground">SKU: <span className="text-foreground/80 font-mono text-xs">{selectedVariant.sku}</span></span>
                )}
                {selectedVariant.compareAt && selectedVariant.compareAt.value > (selectedVariant.price?.value ?? 0) && (
                  <span className="text-muted-foreground">
                    Was <span className="line-through">{formatPrice(selectedVariant.compareAt)}</span>
                  </span>
                )}
              </div>
            )}

            <a
              href={buyUrl}
              target="_blank"
              rel="noopener"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition shadow-lg shadow-gold/20"
            >
              <ShoppingBag className="size-5" /> {(selectedVariant?.inStock ?? p.inStock) ? "Buy on Fourthwall" : "View on Fourthwall"}
              <ExternalLink className="size-4" />
            </a>
            <p className="text-xs text-muted-foreground mt-3 mb-8">
              Secure checkout on Fourthwall. Shipping calculated at checkout.
            </p>

            {p.descriptionHtml && (
              <div
                className="prose prose-invert max-w-none text-foreground/80 leading-relaxed mb-8 [&_p]:mb-3 [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
              />
            )}

            {p.variants.length > 1 && (
              <details className="mt-6 text-sm">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">All variants & prices ({p.variants.length})</summary>
                <ul className="mt-3 divide-y divide-border border border-border rounded-lg overflow-hidden">
                  {p.variants.map((v) => (
                    <li key={v.id} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-card/40">
                      <span className="flex items-center gap-2 min-w-0">
                        {v.color?.swatch && <span className="size-3 rounded-full border border-border" style={{ background: v.color.swatch }} />}
                        <span className="truncate">
                          {v.color?.name ?? ""}{v.color && v.size ? " · " : ""}{v.size ?? ""}
                          {v.sku && <span className="ml-2 text-[11px] text-muted-foreground font-mono">{v.sku}</span>}
                        </span>
                      </span>
                      <span className="text-foreground/80 whitespace-nowrap flex items-center gap-2">
                        {v.compareAt && v.compareAt.value > (v.price?.value ?? 0) && (
                          <span className="text-xs line-through text-muted-foreground">{formatPrice(v.compareAt)}</span>
                        )}
                        {v.price ? formatPrice(v.price) : ""}
                        {!v.inStock && <span className="text-xs text-muted-foreground">Sold out</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
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
