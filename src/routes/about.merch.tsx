import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { ShoppingBag, Globe, Award, Truck, Info } from "lucide-react";

export const Route = createFileRoute("/about/merch")({
  component: MerchPage,
  head: () => ({ meta: [
    { title: "Blues Merch — SlowBlues" },
    { name: "description", content: "Premium print-on-demand merch via Fourthwall — t-shirts, hoodies, posters and more." },
    { property: "og:title", content: "Blues Merch — SlowBlues" },
    { property: "og:image", content: IMG.vinyl },
  ]}),
});

function MerchPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Official Merch" title="Blues Merch" lead="Wear your love for the blues. Premium print-on-demand via Fourthwall — shipped worldwide." img={IMG.vinyl} />
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <Pill icon={Award} label="Print-on-demand" />
          <Pill icon={Globe} label="Worldwide shipping" />
          <Pill icon={ShoppingBag} label="Premium quality" />
        </div>

        <div className="prose prose-invert max-w-none space-y-5 text-foreground/85 leading-relaxed">
          <p>This isn't just clothing and merch. It's a way to show that you belong to the same universe as us — where the slow, soulful blues still means something deep.</p>
          <p>SlowBlues.no has been built entirely by hand, driven by love for the music, the stories, the artists and the feeling. Now we finally have a proper official merch section, and we hope you enjoy it as much as we do.</p>
          <p>All products are premium print-on-demand: organic materials where possible, high quality on both fabric and print, and designs that feel real — not mass-produced standard stuff. Logo and graphics are made with respect for the blues tradition.</p>
          <p>When you buy something here, you contribute directly to keeping SlowBlues.no alive: more articles, more stories, more blues lessons and more content for those of us who love the same thing. It means a lot.</p>
          <p className="italic text-muted-foreground">Thanks for being part of this. Let's keep the blues alive — in your ears and on your back. — Kjell / SlowBlues.no</p>
        </div>

        <a
          href="https://slowblues-shop.fourthwall.com"
          target="_blank"
          rel="noopener"
          className="mt-10 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90"
        >
          <ShoppingBag className="size-5" /> Open the shop
        </a>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <Note icon={Truck} title="Shipping & duties">
            All prices are in USD and do not include shipping. Shipping is added automatically at checkout and varies by country and weight. For deliveries outside the EU (including Norway, Switzerland, UK and others), customs, VAT and/or import fees may apply.
          </Note>
          <Note icon={Info} title="Checkout tips">
            Payment: Card (Visa / Mastercard / AmEx / Discover) + PayPal. Apple Pay / Google Pay may appear depending on device. Use a street address (not PO Box), correct country, and matching postal code.
          </Note>
        </div>
      </section>
    </PageShell>
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
      <div className="flex items-center gap-2 mb-2"><Icon className="size-4 text-gold" /><h3 className="font-display text-lg">{title}</h3></div>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
