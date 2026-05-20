import { createFileRoute } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { galleryImages } from "@/data/galleryImages";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({ meta: [
    { title: "Gallery — SlowBlues" },
    { name: "description", content: "Historic blues photography from the Library of Congress FSA/OWI Collection and Wikimedia Commons — fully credited, public domain." },
    { property: "og:title", content: "Gallery — SlowBlues" },
    { property: "og:image", content: IMG.jukeJoint },
  ]}),
});

// Additional curated public-domain shots from Wikimedia / Library of Congress
const EXTRA_PHOTOS = [
  { src: IMG.delta, caption: "The Mississippi Delta — where it all began", source: "Wikimedia Commons · CC" },
  { src: IMG.chessRecords, caption: "Chess Records building, 2120 South Michigan Avenue, Chicago", source: "Wikimedia Commons · CC BY-SA" },
  { src: IMG.beale, caption: "Beale Street at night, Memphis, Tennessee", source: "Wikimedia Commons · CC" },
  { src: IMG.clarksdale, caption: "The Crossroads in Clarksdale, MS — Highway 49 / Highway 61", source: "Wikimedia Commons · CC" },
  { src: IMG.robertJohnson, caption: "Robert Johnson — only known studio portrait, c. 1936", source: "Hooks Bros. Studio · Public Domain (US)" },
  { src: IMG.muddyWaters, caption: "Muddy Waters at the Hamburg Jazz Festival, 1971 — Heinrich Klaffs", source: "Wikimedia Commons · CC BY-SA" },
  { src: IMG.sonHouse, caption: "Son House", source: "Wikimedia Commons · Public Domain" },
  { src: IMG.bessieSmith, caption: "Bessie Smith, photographed by Carl Van Vechten, 1936", source: "Library of Congress · Public Domain" },
  { src: IMG.leadbelly, caption: "Lead Belly with his Stella 12-string", source: "Library of Congress · Public Domain" },
  { src: IMG.maRainey, caption: "Ma Rainey, c. 1923 — \"Mother of the Blues\"", source: "Wikimedia Commons · Public Domain" },
];

function GalleryPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.gallery.eyebrow} title={t.pages.gallery.title} lead={t.pages.gallery.lead} img={IMG.jukeJoint} />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-8">
          <div className="text-xs tracking-[0.25em] text-gold uppercase mb-2">FSA / OWI Collection</header>
          <h2 className="font-display text-3xl">Library of Congress — Field Photography</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">Farm Security Administration documentary photographs from the late 1930s and early 1940s — the world the blues came from.</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {galleryImages.map((p) => (
            <figure key={p.id} className="bg-card/60 border border-border rounded-lg overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-card">
                <SafeImage src={p.src} alt={p.title} loading="lazy" className="size-full object-cover hover:scale-105 transition duration-700" />
              </div>
              <figcaption className="p-5">
                <div className="font-display text-lg">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.location} · {p.year}</div>
                <div className="text-sm mt-2">Photographer: {p.photographer}</div>
                <div className="text-[11px] text-muted-foreground mt-3">
                  {p.source} · <span className="text-gold">{p.license}</span>
                  {p.commonsUrl && (<> · <a href={p.commonsUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Source</a></>)}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <header className="mt-16 mb-8">
          <div className="text-xs tracking-[0.25em] text-gold uppercase mb-2">Wikimedia / Library of Congress</div>
          <h2 className="font-display text-3xl">Places & Faces</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">Iconic locations and portraits from the blues canon.</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXTRA_PHOTOS.map((p, i) => (
            <figure key={i} className="bg-card/60 border border-border rounded-lg overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-card">
                <SafeImage src={p.src} alt={p.caption} loading="lazy" className="size-full object-cover hover:scale-105 transition duration-700" />
              </div>
              <figcaption className="p-4">
                <div className="text-sm">{p.caption}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{p.source}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
          All images sourced from publicly available archives (Library of Congress, Wikimedia Commons) under Public Domain or Creative Commons licences. Attribution provided per image.
        </p>
      </section>
    </PageShell>
  );
}
