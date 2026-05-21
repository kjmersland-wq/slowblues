import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { Handshake, Mail } from "lucide-react";

export const Route = createFileRoute("/about/advertise")({
  component: AdvertisePage,
  head: () => ({
    meta: [
      { title: "Advertise & Partner — SlowBlues" },
      {
        name: "description",
        content:
          "Partner with SlowBlues — sponsor articles, co-brand merch and reach a global blues audience.",
      },
      { property: "og:title", content: "Advertise & Partner — SlowBlues" },
      { property: "og:image", content: IMG.vinyl },
    ],
  }),
});

const CONTACT_MAILTO =
  "mailto:hello@slowblues.no?subject=" +
  encodeURIComponent("Partner product collaboration inquiry");

function AdvertisePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Partner with us"
        title="Advertise & Collaborate"
        lead="Reach a worldwide audience of blues lovers — through sponsored stories, festival features and co-branded merch."
        img={IMG.vinyl}
      />

      <section className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-card/40 border border-gold/30 rounded-2xl p-8 shadow-[0_0_40px_-20px_var(--color-gold)]">
          <div className="flex items-center gap-3 mb-3">
            <Handshake className="size-6 text-gold" />
            <h2 className="font-display text-2xl md:text-3xl">
              Want your logo on our products?
            </h2>
          </div>
          <p className="text-foreground/85 leading-relaxed mb-6">
            We collaborate with festivals, venues, labels and instrument makers on
            limited-edition merch. Your logo goes on the product, your story goes
            in the description, and part of every sale comes back to you.
          </p>
          <a
            href={CONTACT_MAILTO}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
          >
            <Mail className="size-4" /> Start a partner inquiry
          </a>
          <p className="text-xs text-muted-foreground mt-4">
            Or see{" "}
            <Link to="/about/merch" className="text-gold underline">
              current Partner Editions →
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
