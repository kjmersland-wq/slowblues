import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({ meta: [
    { title: "Gallery — SlowBlues" },
    { name: "description", content: "Historic blues photography from Library of Congress and Wikimedia Commons." },
    { property: "og:title", content: "Gallery — SlowBlues" },
    { property: "og:image", content: IMG.jukeJoint },
  ]}),
});

const PHOTOS = [
  { src: IMG.cottonField, caption: "Picking cotton in Mississippi, c. 1939", source: "Library of Congress · Public Domain" },
  { src: IMG.jukeJoint, caption: "Juke joint, Saturday evening, outside Clarksdale, MS — Marion Post Wolcott, 1939", source: "Library of Congress · FSA Collection · Public Domain" },
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHOTOS.map((p, i) => (
            <figure key={i} className="bg-card/60 border border-border rounded-lg overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-card">
                <img src={p.src} alt={p.caption} loading="lazy" className="size-full object-cover hover:scale-105 transition duration-700" />
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
