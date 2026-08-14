import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { useEffect, useState } from "react";
import { fetchGuestbookEntries, submitGuestbookEntry } from "@/lib/guestbook.functions";

export const Route = createFileRoute("/guestbook")({
  component: GuestbookPage,
  head: () => ({ meta: [
    { title: "Guestbook — SlowBlues" },
    { name: "description", content: "Tell us your blues story." },
    { property: "og:title", content: "Guestbook — SlowBlues" },
  ]}),
});

type Entry = { id: string; name: string; location: string | null; message: string; created_at: string };

function GuestbookPage() {
  const { t, lang } = useI18n();
  const [list, setList] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchGuestbookEntries();
      setList(rows as Entry[]);
    } catch {
      setError(
        tr(lang, {
          no: "Kunne ikke laste gjesteboken. Prøv igjen senere.",
          en: "Couldn't load the guestbook. Please try again later.",
          sv: "Kunde inte läsa in gästboken. Försök igen senare.",
          de: "Das Gästebuch konnte nicht geladen werden. Bitte versuche es später erneut.",
          pl: "Nie udało się wczytać księgi gości. Spróbuj ponownie później.",
        }),
      );
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitGuestbookEntry({ data: { name, location: location || null, message: msg } });
      setName(""); setLocation(""); setMsg("");
      await load();
    } catch {
      setError(
        tr(lang, {
          no: "Innlegget kunne ikke sendes. Sjekk teksten og prøv igjen.",
          en: "The entry couldn't be sent. Check the text and try again.",
          sv: "Inlägget kunde inte skickas. Kontrollera texten och försök igen.",
          de: "Der Eintrag konnte nicht gesendet werden. Überprüfe den Text und versuche es erneut.",
          pl: "Nie udało się wysłać wpisu. Sprawdź tekst i spróbuj ponownie.",
        }),
      );
    }
    setSubmitting(false);
  };

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.guestbook.eyebrow} title={t.pages.guestbook.title} lead={t.pages.guestbook.lead} img={IMG.pianoNight} />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={submit} className="bg-card/60 border border-border rounded-xl p-6 mb-10 space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.guestbook.name}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">
              {tr(lang, { no: "Sted (valgfritt)", en: "Location (optional)", sv: "Ort (valfritt)", de: "Ort (optional)", pl: "Lokalizacja (opcjonalnie)" })}
            </label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={80} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.guestbook.message}</label>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} maxLength={800} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={submitting} className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-60">
            {submitting ? tr(lang, { no: "Sender …", en: "Sending…", sv: "Skickar …", de: "Wird gesendet …", pl: "Wysyłanie…" }) : t.pages.guestbook.submit}
          </button>
        </form>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {tr(lang, { no: "Laster gjesteboken…", en: "Loading the guestbook…", sv: "Läser in gästboken…", de: "Gästebuch wird geladen…", pl: "Wczytywanie księgi gości…" })}
          </p>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {tr(lang, { no: "Ingen innlegg enda — bli den første.", en: "No entries yet — be the first.", sv: "Inga inlägg än — bli den första.", de: "Noch keine Einträge — sei der Erste.", pl: "Brak jeszcze wpisów — bądź pierwszy." })}
          </p>
        ) : (
          <div className="space-y-4">
            {list.map((e) => (
              <article key={e.id} className="bg-card/40 border-l-4 border-gold/60 px-5 py-4 rounded-r-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display text-lg text-gold">
                    {e.name}{e.location ? `, ${e.location}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">{e.created_at.slice(0, 10)}</div>
                </div>
                <p className="text-sm text-foreground/85 italic">"{e.message}"</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
