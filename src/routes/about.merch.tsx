import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import {
  ShoppingBag,
  Globe,
  Award,
  Truck,
  Info,
  ExternalLink,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Handshake,
} from "lucide-react";
import {
  fetchMerchOverview,
  type MerchProduct,
  type MerchVariant,
} from "@/lib/fourthwall.functions";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import {
  activePartners,
  partnerForProduct,
  partnerDescription,
  type Partner,
} from "@/data/partners";
import { useI18n, tr, type Lang } from "@/i18n";

export const Route = createFileRoute("/about/merch")({
  component: MerchPage,
  head: () => ({
    meta: [
      { title: "Blues Merch — SlowBlues" },
      {
        name: "description",
        content:
          "Official SlowBlues merch — t-shirts, hoodies, posters and more. Premium print-on-demand, shipped worldwide.",
      },
      { property: "og:title", content: "Blues Merch — SlowBlues" },
      {
        property: "og:description",
        content: "Wear the blues. Official SlowBlues apparel and prints, shipped worldwide.",
      },
      { property: "og:image", content: IMG.vinyl },
      { property: "og:url", content: "https://www.slow-blues.com/about/merch" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/about/merch" }],
  }),
});

const SHOP_BASE = "https://slow-blues-shop.fourthwall.com";
const CART_STORAGE_KEY = "slowblues_cart_v1";

type CartItem = {
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  variantName: string;
  image: string | null;
  price: number;
  currency: string;
  qty: number;
};

function formatNOK(value: number | null | undefined): string {
  if (value == null) return "";
  return `kr ${new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))}`;
}

function variantUrl(slug: string, variantId: string) {
  return `${SHOP_BASE}/en-nok/products/${slug}?variant=${variantId}`;
}

function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  return {
    items,
    count: items.reduce((a, i) => a + i.qty, 0),
    subtotal: items.reduce((a, i) => a + i.qty * i.price, 0),
    currency: items[0]?.currency ?? "NOK",
    add: (item: CartItem) =>
      setItems((prev) => {
        const idx = prev.findIndex((x) => x.variantId === item.variantId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
          return next;
        }
        return [...prev, item];
      }),
    update: (variantId: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((x) => x.variantId !== variantId)
          : prev.map((x) => (x.variantId === variantId ? { ...x, qty } : x)),
      ),
    remove: (variantId: string) =>
      setItems((prev) => prev.filter((x) => x.variantId !== variantId)),
    clear: () => setItems([]),
  };
}

function MerchPage() {
  const fetcher = useServerFn(fetchMerchOverview);
  const { lang } = useI18n();
  const { data, isLoading, error } = useQuery({
    queryKey: ["merch-overview-nok"],
    queryFn: () => fetcher(),
    staleTime: 5 * 60 * 1000, // 5 min SWR — matches server cache
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const cart = useCart();
  const [active, setActive] = useState<MerchProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const products = data?.products ?? [];
  const featured = products.slice(0, 4);
  const partners = activePartners();
  const partnerProducts = products.filter((p) => partnerForProduct(p.slug));
  const showPartnerSection = partners.length > 0 && partnerProducts.length > 0;

  return (
    <PageShell>
      <PageHero
        eyebrow={tr(lang, { no: "Offisiell merch", en: "Official Merch", sv: "Officiell merch", de: "Offizieller Merch", pl: "Oficjalne gadżety" })}
        title={tr(lang, { no: "Bær bluesen", en: "Wear the Blues", sv: "Bär bluesen", de: "Trag den Blues", pl: "Noś bluesa" })}
        lead={tr(lang, {
          no: "Håndplukkede SlowBlues-klær og -plakater. Premium print-on-demand, sendt over hele verden — hvert kjøp holder musikken i live.",
          en: "Hand-picked SlowBlues apparel and prints. Premium print-on-demand, shipped worldwide — every purchase keeps the music alive.",
          sv: "Handplockade SlowBlues-kläder och tryck. Premium print-on-demand, skickas över hela världen — varje köp håller musiken vid liv.",
          de: "Handverlesene SlowBlues-Kleidung und -Drucke. Premium-Print-on-Demand, weltweiter Versand — jeder Kauf hält die Musik am Leben.",
          pl: "Starannie wybrana odzież i grafiki SlowBlues. Wysokiej jakości druk na żądanie, wysyłka na cały świat — każdy zakup podtrzymuje muzykę przy życiu.",
        })}
        img={IMG.vinyl}
      />

      <section className="max-w-6xl mx-auto px-6 py-12 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="grid sm:grid-cols-3 gap-4 flex-1">
            <Pill icon={Award} label={tr(lang, { no: "Premium print-on-demand", en: "Premium print-on-demand", sv: "Premium print-on-demand", de: "Premium-Print-on-Demand", pl: "Druk na żądanie premium" })} />
            <Pill icon={Globe} label={tr(lang, { no: "Sendes verden over", en: "Shipped worldwide", sv: "Skickas över hela världen", de: "Weltweiter Versand", pl: "Wysyłka na cały świat" })} />
            <Pill icon={ShoppingBag} label={tr(lang, { no: "Design laget med kjærlighet", en: "Designs made with love", sv: "Design skapad med kärlek", de: "Designs mit Liebe gemacht", pl: "Projekty stworzone z pasją" })} />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative ml-4 shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-card border border-gold/30 hover:border-gold transition"
            aria-label={tr(lang, { no: "Åpne handlekurv", en: "Open cart", sv: "Öppna kundvagn", de: "Warenkorb öffnen", pl: "Otwórz koszyk" })}
          >
            <ShoppingCart className="size-5 text-gold" />
            <span className="font-medium hidden sm:inline">{tr(lang, { no: "Handlekurv", en: "Cart", sv: "Kundvagn", de: "Warenkorb", pl: "Koszyk" })}</span>
            {cart.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-primary-foreground text-xs font-bold rounded-full size-6 flex items-center justify-center">
                {cart.count}
              </span>
            )}
          </button>
        </div>

        <div className="prose prose-invert max-w-3xl space-y-5 text-foreground/85 leading-relaxed mb-12">
          <p>
            {tr(lang, {
              no: "Dette er ikke bare klær. Det er en måte å vise at du hører til samme univers som oss — der langsom, sjelfull blues fortsatt betyr noe dypt.",
              en: "This isn't just clothing. It's a way to show that you belong to the same universe as us — where slow, soulful blues still means something deep.",
              sv: "Det här är inte bara kläder. Det är ett sätt att visa att du hör hemma i samma universum som oss — där långsam, själfull blues fortfarande betyder något djupt.",
              de: "Das ist nicht nur Kleidung. Es ist eine Art zu zeigen, dass du zum selben Universum gehörst wie wir — wo langsamer, seelenvoller Blues noch etwas Tiefes bedeutet.",
              pl: "To nie jest zwykłe ubranie. To sposób, by pokazać, że należysz do tego samego świata co my — gdzie powolny, pełen duszy blues wciąż znaczy coś głębokiego.",
            })}
          </p>
          <p>
            {tr(lang, {
              no: "Hvert produkt er premium print-on-demand: kvalitetsstoff, nøye trykk og illustrasjoner laget med respekt for bluestradisjonen. Når du kjøper noe her, holder du SlowBlues i live — flere artikler, flere historier, mer musikk.",
              en: "Every product is premium print-on-demand: quality fabric, careful prints, and artwork made with respect for the blues tradition. When you buy something here, you keep SlowBlues alive — more articles, more stories, more music.",
              sv: "Varje produkt är premium print-on-demand: kvalitetstyg, noggranna tryck och illustrationer skapade med respekt för bluestraditionen. När du köper något här håller du SlowBlues vid liv — fler artiklar, fler historier, mer musik.",
              de: "Jedes Produkt ist Premium-Print-on-Demand: hochwertiger Stoff, sorgfältige Drucke und Artwork mit Respekt vor der Blues-Tradition gestaltet. Wenn du hier etwas kaufst, hältst du SlowBlues am Leben — mehr Artikel, mehr Geschichten, mehr Musik.",
              pl: "Każdy produkt to druk na żądanie w wysokiej jakości: solidna tkanina, staranny nadruk i grafiki stworzone z szacunkiem dla tradycji bluesa. Kupując coś tutaj, utrzymujesz SlowBlues przy życiu — więcej artykułów, więcej historii, więcej muzyki.",
            })}
          </p>
        </div>

        {isLoading && <SkeletonGrid />}

        {(error || data?.error) && !isLoading && (
          <div className="mb-12">
            <iframe
              src="https://slow-blues-shop.fourthwall.com"
              width="100%"
              style={{ border: "none", borderRadius: "12px", minHeight: "900px" }}
              title="SlowBlues Shop"
            />
          </div>
        )}

        {showPartnerSection && !isLoading && !error && !data?.error && (
          <PartnerEditionsSection
            partners={partners}
            products={partnerProducts}
            lang={lang}
            onOpen={setActive}
            onAdd={cart.add}
          />
        )}

        {!isLoading && !error && !data?.error && featured.length > 0 && (
          <div className="mb-16">
            <SectionHeading
              kicker={tr(lang, { no: "Utvalgt", en: "Featured", sv: "Utvalt", de: "Empfohlen", pl: "Wyróżnione" })}
              title={tr(lang, { no: "Denne rundens utvalg", en: "This cycle's picks", sv: "Den här omgångens urval", de: "Die Auswahl dieser Runde", pl: "Wybór tego cyklu" })}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} p={p} lang={lang} onOpen={() => setActive(p)} onAdd={cart.add} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && !error && !data?.error && products.length > 0 && (
          <div id="merch-grid" className="mb-12 scroll-mt-24">
            <SectionHeading
              kicker={tr(lang, { no: "Alle produkter", en: "All products", sv: "Alla produkter", de: "Alle Produkte", pl: "Wszystkie produkty" })}
              title={tr(lang, { no: "Hele butikken", en: "The full shop", sv: "Hela butiken", de: "Der ganze Shop", pl: "Cały sklep" })}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} lang={lang} onOpen={() => setActive(p)} onAdd={cart.add} />
              ))}
            </div>
          </div>
        )}

        <div className="text-center py-8">
          <a
            href={`${SHOP_BASE}/en-nok`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
          >
            <ShoppingBag className="size-5" />
            {tr(lang, { no: "Åpne hele butikken på Fourthwall", en: "Open the full shop on Fourthwall", sv: "Öppna hela butiken på Fourthwall", de: "Den ganzen Shop auf Fourthwall öffnen", pl: "Otwórz cały sklep na Fourthwall" })}
            <ExternalLink className="size-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Note icon={Truck} title={tr(lang, { no: "Frakt & avgifter", en: "Shipping & duties", sv: "Frakt & avgifter", de: "Versand & Zölle", pl: "Wysyłka i cła" })}>
            {tr(lang, {
              no: "Priser er i NOK og inkluderer ikke frakt. Frakt legges til i kassen. Utenfor EU/EØS kan toll og moms tilkomme.",
              en: "Prices are in NOK and don't include shipping. Shipping is added at checkout. Outside the EU/EEA customs and VAT may apply.",
              sv: "Priser är i NOK och inkluderar inte frakt. Frakt läggs till i kassan. Utanför EU/EES kan tull och moms tillkomma.",
              de: "Preise sind in NOK und beinhalten keinen Versand. Versandkosten werden an der Kasse hinzugefügt. Außerhalb der EU/des EWR können Zoll und Mehrwertsteuer anfallen.",
              pl: "Ceny podane są w NOK i nie obejmują wysyłki. Koszt wysyłki jest doliczany przy kasie. Poza UE/EOG mogą obowiązywać cło i VAT.",
            })}
          </Note>
          <Note icon={Info} title={tr(lang, { no: "Sikker betaling", en: "Secure checkout", sv: "Säker betalning", de: "Sichere Bezahlung", pl: "Bezpieczna płatność" })}>
            {tr(lang, {
              no: "Handlekurv og betaling skjer sikkert hos Fourthwall. Kort (Visa / Mastercard / AmEx / Discover), PayPal, og Apple/Google Pay der det støttes.",
              en: "Cart and payment happen securely on Fourthwall. Cards (Visa / Mastercard / AmEx / Discover), PayPal, and Apple/Google Pay where supported.",
              sv: "Kundvagn och betalning sker säkert hos Fourthwall. Kort (Visa / Mastercard / AmEx / Discover), PayPal, och Apple/Google Pay där det stöds.",
              de: "Warenkorb und Zahlung erfolgen sicher über Fourthwall. Karten (Visa / Mastercard / AmEx / Discover), PayPal und Apple/Google Pay, wo unterstützt.",
              pl: "Koszyk i płatność odbywają się bezpiecznie w Fourthwall. Karty (Visa / Mastercard / AmEx / Discover), PayPal oraz Apple/Google Pay tam, gdzie są obsługiwane.",
            })}
          </Note>
        </div>
      </section>

      {active && (
        <ProductModal product={active} onClose={() => setActive(null)} onAdd={cart.add} lang={lang} />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        lang={lang}
      />

      {/* Fixed back-to-grid button */}
      {!active && !cartOpen && products.length > 4 && (
        <a
          href="#merch-grid"
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card/95 border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition shadow-xl backdrop-blur"
        >
          <ArrowLeft className="size-4 rotate-90" /> {tr(lang, { no: "Se alle produkter", en: "See all products", sv: "Se alla produkter", de: "Alle Produkte ansehen", pl: "Zobacz wszystkie produkty" })}
        </a>
      )}
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

function SkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card/40 border border-border rounded-xl overflow-hidden">
          <div className="aspect-square bg-muted/40 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted/40 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted/30 rounded animate-pulse w-1/2" />
            <div className="h-9 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCard({
  p,
  lang,
  onOpen,
  onAdd,
}: {
  p: MerchProduct;
  lang: Lang;
  onOpen: () => void;
  onAdd: (i: CartItem) => void;
}) {
  const [hover, setHover] = useState(false);
  const [size, setSize] = useState<string>(p.sizes[0] ?? "");
  const [color, setColor] = useState<string>(p.colors[0]?.name ?? "");

  const variant = useMemo(() => pickVariant(p, color, size), [p, color, size]);
  const img = (hover && p.images[1]) || p.image || "";
  const short = p.description.length > 100 ? p.description.slice(0, 100).trim() + "…" : p.description;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!variant) return;
    onAdd({
      productId: p.id,
      productSlug: p.slug,
      productName: p.name,
      variantId: variant.id,
      variantName: variant.name,
      image: variant.image ?? p.image,
      price: variant.price?.value ?? p.price?.value ?? 0,
      currency: variant.price?.currency ?? p.price?.currency ?? "NOK",
      qty: 1,
    });
  };

  const partner = partnerForProduct(p.slug);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group cursor-pointer bg-card/40 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition flex flex-col"
    >
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="size-8" />
          </div>
        )}
        {partner && (
          <>
            <div
              className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow"
              style={{ background: partner.accentColor }}
            >
              {PARTNER_BADGE[lang] ?? PARTNER_BADGE.en}
            </div>
            <div
              className="absolute bottom-2 left-2 z-10 h-8 rounded-md bg-white/95 px-2 flex items-center shadow"
              title={`In collaboration with ${partner.name}`}
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-6 max-w-[80px] object-contain"
                />
              ) : (
                <span className="text-[10px] font-bold text-black">{partner.name}</span>
              )}
            </div>
          </>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg leading-tight mb-1 group-hover:text-gold transition">
          {p.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{short}</p>
        <div className="text-foreground/90 font-medium mb-3">
          {formatNOK(variant?.price?.value ?? p.price?.value ?? 0)}
        </div>

        {p.colors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
            {p.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                title={c.name}
                aria-label={c.name}
                className={`size-5 rounded-full border-2 transition ${
                  color === c.name ? "border-gold scale-110" : "border-border"
                }`}
                style={{ background: c.swatch ?? "#888" }}
              />
            ))}
          </div>
        )}

        {p.sizes.length > 1 && (
          <select
            value={size}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setSize(e.target.value);
            }}
            className="w-full mb-3 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          >
            {p.sizes.map((s) => (
              <option key={s} value={s}>
                {tr(lang, { no: "Størrelse", en: "Size", sv: "Storlek", de: "Größe", pl: "Rozmiar" })}: {s}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleAdd}
          disabled={!variant?.inStock}
          className="mt-auto w-full bg-gold text-primary-foreground font-medium py-2.5 rounded-md hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {variant?.inStock === false
            ? tr(lang, { no: "Utsolgt", en: "Sold out", sv: "Slutsåld", de: "Ausverkauft", pl: "Wyprzedany" })
            : tr(lang, { no: "Legg i handlekurv", en: "Add to cart", sv: "Lägg i kundvagn", de: "In den Warenkorb", pl: "Dodaj do koszyka" })}
        </button>
      </div>
    </div>
  );
}

function pickVariant(p: MerchProduct, color: string, size: string): MerchVariant | null {
  if (!p.variants.length) return null;
  const matchBoth = p.variants.find(
    (v) => (!color || v.color?.name === color) && (!size || v.size === size),
  );
  if (matchBoth) return matchBoth;
  const matchColor = p.variants.find((v) => v.color?.name === color);
  if (matchColor) return matchColor;
  return p.variants[0];
}

function ProductModal({
  product,
  onClose,
  onAdd,
  lang,
}: {
  product: MerchProduct;
  onClose: () => void;
  onAdd: (i: CartItem) => void;
  lang: Lang;
}) {
  const partner = partnerForProduct(product.slug);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const variant = useMemo(() => pickVariant(product, color, size), [product, color, size]);
  const images = product.images.length ? product.images : variant?.image ? [variant.image] : [];
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const buyNowUrl = variant ? variantUrl(product.slug, variant.id) : product.shopUrl;

  const add = () => {
    if (!variant) return;
    onAdd({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      variantName: variant.name,
      image: variant.image ?? product.image,
      price: variant.price?.value ?? 0,
      currency: variant.price?.currency ?? "NOK",
      qty,
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-8 flex items-start sm:items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl max-w-5xl w-full grid md:grid-cols-2 gap-6 p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition z-10"
          aria-label={tr(lang, { no: "Lukk", en: "Close", sv: "Stäng", de: "Schließen", pl: "Zamknij" })}
        >
          <X className="size-5" />
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/40 bg-card/60 text-gold hover:bg-gold/10 hover:border-gold transition text-xs font-medium z-10"
        >
          <ArrowLeft className="size-3.5" /> {tr(lang, { no: "Tilbake til butikken", en: "Back to shop", sv: "Tillbaka till butiken", de: "Zurück zum Shop", pl: "Powrót do sklepu" })}
        </button>

        <div>
          <div className="aspect-square bg-muted/30 rounded-xl overflow-hidden mb-3">
            {images[imgIdx] && (
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition ${
                    imgIdx === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="font-display text-2xl md:text-3xl mb-2">{product.name}</h2>
          <div className="text-xl text-gold font-medium mb-4">
            {formatNOK(variant?.price?.value ?? product.price?.value ?? 0)}
          </div>

          <div
            className="prose prose-invert prose-sm max-w-none text-foreground/80 mb-5 max-h-48 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.descriptionHtml || product.description) }}
          />

          {partner && (
            <div
              className="mb-5 rounded-lg border p-4 flex items-center gap-3"
              style={{
                borderColor: partner.accentColor + "66",
                background: partner.accentColor + "10",
              }}
            >
              {partner.logoUrl && (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-10 w-10 object-contain bg-white rounded p-1 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0 text-sm">
                <div className="font-medium mb-0.5">
                  🤝 {tr(lang, { no: "Partner-utgave — laget i samarbeid med", en: "Partner Edition — made in collaboration with", sv: "Partnerupplaga — skapad i samarbete med", de: "Partner-Edition — in Zusammenarbeit mit", pl: "Edycja partnerska — stworzona we współpracy z" })}{" "}
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gold"
                  >
                    {partner.name}
                  </a>
                </div>
                <div className="text-xs text-muted-foreground">
                  {tr(lang, { no: "En del av inntektene støtter", en: "Part of the proceeds supports", sv: "En del av intäkterna stödjer", de: "Ein Teil des Erlöses unterstützt", pl: "Część dochodu wspiera" })} {partner.name}.{" "}
                  <span className="italic">{partnerDescription(partner, lang)}</span>
                </div>
              </div>
            </div>
          )}


          {product.colors.length > 0 && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {tr(lang, { no: "Farge", en: "Color", sv: "Färg", de: "Farbe", pl: "Kolor" })}: <span className="text-foreground">{color}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    className={`size-8 rounded-full border-2 transition ${
                      color === c.name ? "border-gold scale-110" : "border-border"
                    }`}
                    style={{ background: c.swatch ?? "#888" }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{tr(lang, { no: "Størrelse", en: "Size", sv: "Storlek", de: "Größe", pl: "Rozmiar" })}</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-md border text-sm transition ${
                      size === s
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {tr(lang, { no: "Antall", en: "Quantity", sv: "Antal", de: "Menge", pl: "Ilość" })}
            </div>
            <div className="inline-flex items-center border border-border rounded-md">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-muted transition"
                aria-label={tr(lang, { no: "Reduser", en: "Decrease", sv: "Minska", de: "Verringern", pl: "Zmniejsz" })}
              >
                <Minus className="size-4" />
              </button>
              <span className="px-5 font-medium tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 hover:bg-muted transition"
                aria-label={tr(lang, { no: "Øk", en: "Increase", sv: "Öka", de: "Erhöhen", pl: "Zwiększ" })}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button
              onClick={add}
              disabled={!variant?.inStock}
              className="flex-1 bg-card border-2 border-gold text-gold font-medium py-3 rounded-md hover:bg-gold/10 transition disabled:opacity-50"
            >
              {tr(lang, { no: "Legg i handlekurv", en: "Add to cart", sv: "Lägg i kundvagn", de: "In den Warenkorb", pl: "Dodaj do koszyka" })}
            </button>
            <a
              href={buyNowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-gold text-primary-foreground font-medium py-3 rounded-md hover:bg-gold/90 transition inline-flex items-center justify-center gap-2"
            >
              {tr(lang, { no: "Kjøp nå", en: "Buy now", sv: "Köp nu", de: "Jetzt kaufen", pl: "Kup teraz" })} <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  onClose,
  cart,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  cart: ReturnType<typeof useCart>;
  lang: Lang;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-card border-l border-border flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl flex items-center gap-2">
            <ShoppingCart className="size-5 text-gold" /> {tr(lang, { no: "Handlekurv", en: "Your cart", sv: "Din kundvagn", de: "Dein Warenkorb", pl: "Twój koszyk" })} ({cart.count})
          </h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-muted" aria-label={tr(lang, { no: "Lukk handlekurv", en: "Close cart", sv: "Stäng kundvagn", de: "Warenkorb schließen", pl: "Zamknij koszyk" })}>
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingBag className="size-10 mx-auto mb-3 opacity-50" />
              {tr(lang, { no: "Handlekurven er tom.", en: "Your cart is empty.", sv: "Din kundvagn är tom.", de: "Dein Warenkorb ist leer.", pl: "Twój koszyk jest pusty." })}
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-3 pb-4 border-b border-border last:border-0"
              >
                <div className="size-20 shrink-0 bg-muted/30 rounded-md overflow-hidden">
                  {item.image && (
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight mb-1 truncate">
                    {item.productName}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2 truncate">
                    {item.variantName}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center border border-border rounded text-xs">
                      <button
                        onClick={() => cart.update(item.variantId, item.qty - 1)}
                        className="px-2 py-1 hover:bg-muted"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="px-3 tabular-nums">{item.qty}</span>
                      <button
                        onClick={() => cart.update(item.variantId, item.qty + 1)}
                        className="px-2 py-1 hover:bg-muted"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <div className="text-sm font-medium">{formatNOK(item.price * item.qty)}</div>
                  </div>
                </div>
                <button
                  onClick={() => cart.remove(item.variantId)}
                  className="text-muted-foreground hover:text-destructive p-1 self-start"
                  aria-label={tr(lang, { no: "Fjern", en: "Remove", sv: "Ta bort", de: "Entfernen", pl: "Usuń" })}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">{tr(lang, { no: "Delsum", en: "Subtotal", sv: "Delsumma", de: "Zwischensumme", pl: "Suma częściowa" })}</span>
              <span className="font-display text-xl">{formatNOK(cart.subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {tr(lang, {
                no: "Frakt og eventuelle avgifter beregnes i kassen hos Fourthwall.",
                en: "Shipping and any taxes are calculated at checkout on Fourthwall.",
                sv: "Frakt och eventuella avgifter beräknas i kassan hos Fourthwall.",
                de: "Versand und etwaige Abgaben werden an der Kasse bei Fourthwall berechnet.",
                pl: "Koszty wysyłki i ewentualne podatki są obliczane przy kasie w Fourthwall.",
              })}
            </p>
            <a
              href={`${SHOP_BASE}/en-nok/cart`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-gold text-primary-foreground font-medium py-3 rounded-md hover:bg-gold/90 transition"
            >
              {tr(lang, { no: "Gå til kassen", en: "Go to checkout", sv: "Gå till kassan", de: "Zur Kasse gehen", pl: "Przejdź do kasy" })}
              <ExternalLink className="size-4 inline ml-2" />
            </a>
            <button
              onClick={cart.clear}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition"
            >
              {tr(lang, { no: "Tøm handlekurv", en: "Clear cart", sv: "Töm kundvagn", de: "Warenkorb leeren", pl: "Wyczyść koszyk" })}
            </button>
          </div>
        )}
      </aside>
    </>
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

function Note({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
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

const PARTNER_SECTION_COPY: Record<string, { heading: string; sub: string; partnersLabel: string }> = {
  en: {
    heading: "Partner Editions",
    sub: "Selected products created in collaboration with blues partners. Every purchase supports both SlowBlues and our partners.",
    partnersLabel: "Our partners",
  },
  no: {
    heading: "Partner-utgaver",
    sub: "Utvalgte produkter laget i samarbeid med bluespartnere. Hvert kjøp støtter både SlowBlues og våre partnere.",
    partnersLabel: "Våre partnere",
  },
  de: {
    heading: "Partner-Editionen",
    sub: "Ausgewählte Produkte in Zusammenarbeit mit Blues-Partnern. Jeder Kauf unterstützt sowohl SlowBlues als auch unsere Partner.",
    partnersLabel: "Unsere Partner",
  },
  sv: {
    heading: "Partnerupplagor",
    sub: "Utvalda produkter skapade tillsammans med bluespartners. Varje köp stödjer både SlowBlues och våra partners.",
    partnersLabel: "Våra partners",
  },
  pl: {
    heading: "Edycje partnerskie",
    sub: "Wybrane produkty stworzone we współpracy z bluesowymi partnerami. Każdy zakup wspiera zarówno SlowBlues, jak i naszych partnerów.",
    partnersLabel: "Nasi partnerzy",
  },
};

const PARTNER_BADGE: Record<string, string> = {
  no: "Partner-utgave",
  en: "Partner Edition",
  sv: "Partnerupplaga",
  de: "Partner-Edition",
  pl: "Edycja partnerska",
};

function PartnerEditionsSection({
  partners,
  products,
  lang,
  onOpen,
  onAdd,
}: {
  partners: Partner[];
  products: MerchProduct[];
  lang: Lang;
  onOpen: (p: MerchProduct) => void;
  onAdd: (i: CartItem) => void;
}) {
  const copy = PARTNER_SECTION_COPY[lang] ?? PARTNER_SECTION_COPY.en;
  return (
    <section
      className="mb-16 rounded-2xl border border-gold/40 bg-gradient-to-b from-gold/[0.04] to-transparent p-6 sm:p-8 shadow-[0_0_60px_-30px_var(--color-gold)]"
      aria-labelledby="partner-editions-heading"
    >
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-3">
          <Handshake className="size-4" /> {PARTNER_BADGE[lang] ?? PARTNER_BADGE.en}
        </div>
        <h2 id="partner-editions-heading" className="font-display text-3xl md:text-4xl mb-3">
          {copy.heading}
        </h2>
        <p className="text-foreground/80 max-w-2xl leading-relaxed">{copy.sub}</p>
      </div>

      {partners.length > 0 && (
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
            {copy.partnersLabel}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {partners.map((p) => (
              <a
                key={p.id}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                title={p.name}
                className="group inline-flex items-center"
              >
                {p.logoUrl ? (
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="h-10 max-w-[140px] object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition"
                  />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-gold transition">
                    {p.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} lang={lang} onOpen={() => onOpen(p)} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
