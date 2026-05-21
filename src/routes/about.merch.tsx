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
import {
  activePartners,
  partnerForProduct,
  partnerDescription,
  type Partner,
} from "@/data/partners";
import { useI18n } from "@/i18n";

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
      { property: "og:url", content: "https://sslow-blues.lovable.app/about/merch" },
    ],
    links: [{ rel: "canonical", href: "https://sslow-blues.lovable.app/about/merch" }],
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
        eyebrow="Official Merch"
        title="Wear the Blues"
        lead="Hand-picked SlowBlues apparel and prints. Premium print-on-demand, shipped worldwide — every purchase keeps the music alive."
        img={IMG.vinyl}
      />

      <section className="max-w-6xl mx-auto px-6 py-12 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="grid sm:grid-cols-3 gap-4 flex-1">
            <Pill icon={Award} label="Premium print-on-demand" />
            <Pill icon={Globe} label="Shipped worldwide" />
            <Pill icon={ShoppingBag} label="Designs made with love" />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative ml-4 shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-card border border-gold/30 hover:border-gold transition"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-5 text-gold" />
            <span className="font-medium hidden sm:inline">Cart</span>
            {cart.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-primary-foreground text-xs font-bold rounded-full size-6 flex items-center justify-center">
                {cart.count}
              </span>
            )}
          </button>
        </div>

        <div className="prose prose-invert max-w-3xl space-y-5 text-foreground/85 leading-relaxed mb-12">
          <p>
            This isn't just clothing. It's a way to show that you belong to the same universe as us
            — where slow, soulful blues still means something deep.
          </p>
          <p>
            Every product is premium print-on-demand: quality fabric, careful prints, and artwork
            made with respect for the blues tradition. When you buy something here, you keep
            SlowBlues alive — more articles, more stories, more music.
          </p>
        </div>

        {isLoading && <SkeletonGrid />}

        {(error || data?.error) && !isLoading && (
          <div className="text-center py-16 border border-border rounded-xl bg-card/40">
            <p className="text-foreground/80 mb-3">
              Shop is temporarily unavailable —{" "}
              <a
                href={SHOP_BASE}
                target="_blank"
                rel="noopener"
                className="text-gold underline hover:text-gold/80"
              >
                visit slow-blues-shop.fourthwall.com directly
              </a>
            </p>
          </div>
        )}

        {!isLoading && !error && !data?.error && featured.length > 0 && (
          <div className="mb-16">
            <SectionHeading kicker="Featured" title="This cycle's picks" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} p={p} onOpen={() => setActive(p)} onAdd={cart.add} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && !error && !data?.error && products.length > 0 && (
          <div id="merch-grid" className="mb-12 scroll-mt-24">
            <SectionHeading kicker="All products" title="The full shop" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} onOpen={() => setActive(p)} onAdd={cart.add} />
              ))}
            </div>
          </div>
        )}

        <div className="text-center py-8">
          <a
            href={`${SHOP_BASE}/en-nok`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
          >
            <ShoppingBag className="size-5" /> Open the full shop on Fourthwall
            <ExternalLink className="size-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Note icon={Truck} title="Shipping & duties">
            Prices are in NOK and don't include shipping. Shipping is added at checkout. Outside the
            EU/EEA customs and VAT may apply.
          </Note>
          <Note icon={Info} title="Secure checkout">
            Cart and payment happen securely on Fourthwall. Cards (Visa / Mastercard / AmEx /
            Discover), PayPal, and Apple/Google Pay where supported.
          </Note>
        </div>
      </section>

      {active && (
        <ProductModal product={active} onClose={() => setActive(null)} onAdd={cart.add} />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
      />

      {/* Fixed back-to-grid button */}
      {!active && !cartOpen && products.length > 4 && (
        <a
          href="#merch-grid"
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card/95 border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition shadow-xl backdrop-blur"
        >
          <ArrowLeft className="size-4 rotate-90" /> Se alle produkter
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
  onOpen,
  onAdd,
}: {
  p: MerchProduct;
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

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group cursor-pointer bg-card/40 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition flex flex-col"
    >
      <div className="aspect-square bg-muted/30 overflow-hidden">
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
                Size: {s}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleAdd}
          disabled={!variant?.inStock}
          className="mt-auto w-full bg-gold text-primary-foreground font-medium py-2.5 rounded-md hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {variant?.inStock === false ? "Sold out" : "Add to cart"}
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
}: {
  product: MerchProduct;
  onClose: () => void;
  onAdd: (i: CartItem) => void;
}) {
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
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/40 bg-card/60 text-gold hover:bg-gold/10 hover:border-gold transition text-xs font-medium z-10"
        >
          <ArrowLeft className="size-3.5" /> Tilbake til butikken
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
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
          />

          {product.colors.length > 0 && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Color: <span className="text-foreground">{color}</span>
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Size</div>
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
              Quantity
            </div>
            <div className="inline-flex items-center border border-border rounded-md">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-muted transition"
                aria-label="Decrease"
              >
                <Minus className="size-4" />
              </button>
              <span className="px-5 font-medium tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 hover:bg-muted transition"
                aria-label="Increase"
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
              Add to cart
            </button>
            <a
              href={buyNowUrl}
              target="_blank"
              rel="noopener"
              className="flex-1 text-center bg-gold text-primary-foreground font-medium py-3 rounded-md hover:bg-gold/90 transition inline-flex items-center justify-center gap-2"
            >
              Buy now <ExternalLink className="size-4" />
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
}: {
  open: boolean;
  onClose: () => void;
  cart: ReturnType<typeof useCart>;
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
            <ShoppingCart className="size-5 text-gold" /> Your cart ({cart.count})
          </h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-muted" aria-label="Close cart">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingBag className="size-10 mx-auto mb-3 opacity-50" />
              Your cart is empty.
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
                  aria-label="Remove"
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
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl">{formatNOK(cart.subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and any taxes are calculated at checkout on Fourthwall.
            </p>
            <a
              href={`${SHOP_BASE}/en-nok/cart`}
              target="_blank"
              rel="noopener"
              className="block text-center bg-gold text-primary-foreground font-medium py-3 rounded-md hover:bg-gold/90 transition"
            >
              Go to checkout
              <ExternalLink className="size-4 inline ml-2" />
            </a>
            <button
              onClick={cart.clear}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition"
            >
              Clear cart
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
