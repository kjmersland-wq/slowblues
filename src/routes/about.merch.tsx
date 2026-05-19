import { createFileRoute, Link, useServerFn } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { ShoppingBag, Globe, Award, Truck, Info, ExternalLink, Loader2 } from "lucide-react";
import { fetchMerchOverview, type MerchProduct, type MerchCollection } from "@/lib/fourthwall.functions";

export const Route = createFileRoute("/about/merch")({
  component: MerchPage,
  head: () => ({
    meta: [
      { title: "Blues Merch — SlowBlues" },
      { name: "description", content: "Official SlowBlues merch — t-shirts, hoodies, posters and more. Premium print-on-demand, shipped worldwide via Fourthwall." },
      { property: "og:title", content: "Blues Merch — SlowBlues" },
      { property: "og:description", content: "Wear the blues. Official SlowBlues apparel and prints, shipped worldwide." },
      { property: "og:image", content: IMG.vinyl },
      { property: "og:url", content: "https://sslow-blues.lovable.app/about/merch" },
    ],
    links: [{ rel: "canonical", href: "https://sslow-blues.lovable.app/about/merch" }],
  }),
});

function formatPrice(p: MerchProduct["price"]) {
  if (!p) return "";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.value);
  } catch {
    return `${p.value} ${p.currency}`;
  }
}

function MerchPage() {
  const fetcher = useServerFn(fetchMerchOverview);
  const { data, isLoading, error } = useQuery({
    queryKey: ["merch-overview"],
    queryFn: () => fetcher(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Official Merch"
        title="Wear the Blues"
        lead="Hand-picked SlowBlues apparel and prints. Premium print-on-demand, shipped worldwide — every purchase keeps the music alive."
        img={IMG.vinyl}
      />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <Pill icon={Award} label="Premium print-on-demand" />
          <Pill icon={Globe} label="Shipped worldwide" />
          <Pill icon={ShoppingBag} label="Designs made with love" />
        </div>

        <div className="prose prose-invert max-w-3xl space-y-5 text-foreground/85 leading-relaxed mb-16">
          <p>This isn't just clothing. It's a way to show that you belong to the same universe as us — where slow, soulful blues still means something deep.</p>
          <p>Every product is premium print-on-demand: quality fabric, careful prints, and artwork made with respect for the blues tradition. When you buy something here, you keep SlowBlues alive — more articles, more stories, more music.</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" /> Loading the shop…
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-muted-foreground">
            Couldn't reach the shop right now.{" "}
            <a href="https://slowblues-shop.fourthwall.com" target="_blank" rel="noopener" className="text-gold underline">
              Open Fourthwall directly →
            </a>
          </div>
        )}

        {data && data.error && (
          <div className="text-center py-12 text-muted-foreground">{data.error}</div>
        )}

        {data && !data.error && data.featured.length > 0 && (
          <div className="mb-20">
            <SectionHeading kicker="Featured" title="This cycle's picks" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.featured.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        )}

        {data && data.collections.length > 0 && (
          <div className="mb-20">
            <SectionHeading kicker="Collections" title="Browse by collection" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.collections.map((c) => <CollectionCard key={c.id} c={c} />)}
            </div>
          </div>
        )}

        {data && data.products.length > 0 && (
          <div className="mb-16">
            <SectionHeading kicker="All products" title="The full shop" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        )}

        <div className="text-center py-8">
          <a
            href={data?.shopUrl ?? "https://slowblues-shop.fourthwall.com"}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
          >
            <ShoppingBag className="size-5" /> Open the full shop on Fourthwall
            <ExternalLink className="size-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <Note icon={Truck} title="Shipping & duties">
            Prices are in USD and don't include shipping. Shipping is added at checkout. Outside the EU (Norway, UK, US, etc.) customs and VAT may apply.
          </Note>
          <Note icon={Info} title="Secure checkout">
            Cart and payment happen securely on Fourthwall. Cards (Visa / Mastercard / AmEx / Discover), PayPal, and Apple/Google Pay where supported.
          </Note>
        </div>
      </section>
    </PageShell>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">{kicker}</div>
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}

function ProductCard({ p }: { p: MerchProduct }) {
  return (
    <Link
      to="/about/merch/$slug"
      params={{ slug: p.slug }}
      className="group block bg-card/40 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition"
    >
      <div className="aspect-square bg-muted/30 overflow-hidden">
        {p.image ? (
          <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="size-8" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg leading-tight mb-1 group-hover:text-gold transition">{p.name}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/80">{formatPrice(p.price)}</span>
          {!p.inStock && <span className="text-xs text-muted-foreground">Sold out</span>}
        </div>
      </div>
    </Link>
  );
}

function CollectionCard({ c }: { c: MerchCollection }) {
  return (
    <Link
      to="/about/merch/collection/$slug"
      params={{ slug: c.slug }}
      className="group block bg-card/40 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition"
    >
      <div className="aspect-[16/10] bg-muted/30 overflow-hidden">
        {c.image ? (
          <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gold/10 to-transparent" />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl mb-1 group-hover:text-gold transition">{c.name}</h3>
        {c.description && <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
      </div>
    </Link>
  );
}

function Pill({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 bg-card/60 border border-gold/20 rounded-lg px-4 py-3">
      <Icon className="size-5 text-gold" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function Note({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card/40 border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 text-gold" />
        <h3 className="font-display text-lg">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
