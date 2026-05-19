import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { useState } from "react";

export const Route = createFileRoute("/guestbook")({
  component: GuestbookPage,
  head: () => ({ meta: [
    { title: "Guestbook — SlowBlues" },
    { name: "description", content: "Tell us your blues story." },
    { property: "og:title", content: "Guestbook — SlowBlues" },
  ]}),
});

const ENTRIES = [
  { name: "Lars, Notodden", date: "2026-04-30", text: "Heard Muddy on the radio at 14. Never looked back. Thanks for keeping the flame alive." },
  { name: "Marianne", date: "2026-04-18", text: "Tok med datteren min på Mandal Blues for første gang i fjor — nå er hun frelst på 13 år. Bluesen lever videre." },
  { name: "Tom from Hamburg", date: "2026-04-02", text: "Found this site by accident, lost an entire afternoon in the artist profiles. Beautifully done." },
  { name: "Anna, Bergen", date: "2026-03-21", text: "Tusen takk for det norske perspektivet — sjelden å se Notodden nevnt i samme setning som Chess Records." },
];

function GuestbookPage() {
  const { t } = useI18n();
  const [list, setList] = useState(ENTRIES);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    setList([{ name, date: new Date().toISOString().slice(0, 10), text: msg }, ...list]);
    setName(""); setMsg("");
  };

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.guestbook.eyebrow} title={t.pages.guestbook.title} lead={t.pages.guestbook.lead} img={IMG.pianoNight} />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={submit} className="bg-card/60 border border-border rounded-xl p-6 mb-10 space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.guestbook.name}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.guestbook.message}</label>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <button className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
            {t.pages.guestbook.submit}
          </button>
        </form>

        <div className="space-y-4">
          {list.map((e, i) => (
            <article key={i} className="bg-card/40 border-l-4 border-gold/60 px-5 py-4 rounded-r-md">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-lg text-gold">{e.name}</div>
                <div className="text-xs text-muted-foreground">{e.date}</div>
              </div>
              <p className="text-sm text-foreground/85 italic">"{e.text}"</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
