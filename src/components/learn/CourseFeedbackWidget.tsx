import { useEffect, useRef, useState } from "react";
import { Star, Flag, Copy, Check } from "lucide-react";
import { useI18n, tr, type Lang } from "@/i18n";
import { submitCourseFeedback, reportCourseFeedback, fetchPublicCourseFeedback, type CourseFeedbackInstrument } from "@/lib/courseFeedback.functions";

const ADJUST_CHIPS: Record<Lang, string>[] = [
  { en: "Too fast", no: "For fort", sv: "För snabbt", de: "Zu schnell", pl: "Za szybko" },
  { en: "Too slow", no: "For sakte", sv: "För långsamt", de: "Zu langsam", pl: "Za wolno" },
  { en: "Video didn't load", no: "Videoen lastet ikke", sv: "Videon laddade inte", de: "Video hat nicht geladen", pl: "Wideo się nie ładowało" },
  { en: "Instructions unclear", no: "Uklare instruksjoner", sv: "Otydliga instruktioner", de: "Anleitung unklar", pl: "Niejasne instrukcje" },
  { en: "Just right", no: "Akkurat passe", sv: "Precis lagom", de: "Genau richtig", pl: "W sam raz" },
  { en: "Want more detail", no: "Vil ha mer detaljer", sv: "Vill ha mer detaljer", de: "Möchte mehr Details", pl: "Chcę więcej szczegółów" },
];

export function CourseFeedbackWidget({ instrument, lessonId }: { instrument: CourseFeedbackInstrument; lessonId: string | null }) {
  const { lang } = useI18n();
  const [entries, setEntries] = useState<{ id: string; rating: number; comment: string | null; display_name: string | null; country: string | null; adjust_chips: string[] }[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [reported, setReported] = useState<Set<string>>(new Set());

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [worked, setWorked] = useState<boolean | null>(null);
  const [chips, setChips] = useState<Set<number>>(new Set());
  const [comment, setComment] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [consentPublic, setConsentPublic] = useState(false);
  const [privateToEditor, setPrivateToEditor] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [deleteLink, setDeleteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const mountedAt = useRef(Date.now());

  const load = () => {
    fetchPublicCourseFeedback({ data: { instrument, lessonId, limit: 10 } })
      .then((res) => {
        setEntries(res.entries);
        setAverage(res.average);
        setCount(res.count);
      })
      .catch(() => { /* feedback list is non-critical, fail quiet */ });
  };
  useEffect(load, [instrument, lessonId]);

  const toggleChip = (i: number) => {
    setChips((c) => {
      const next = new Set(c);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const submit = async () => {
    if (rating < 1) return;
    setStatus("busy");
    try {
      const res = await submitCourseFeedback({
        data: {
          instrument,
          lessonId,
          rating,
          worked,
          adjustChips: [...chips].map((i) => ADJUST_CHIPS[i].en),
          comment,
          displayName,
          country: country || null,
          email,
          privateToEditor,
          consentPublic,
          locale: lang,
          website,
          elapsedMs: Date.now() - mountedAt.current,
        },
      });
      setStatus("done");
      setDeleteLink(`${window.location.origin}/learn/play/feedback/delete/${res.deleteToken}`);
      load();
    } catch {
      setStatus("error");
    }
  };

  const report = async (id: string) => {
    if (reported.has(id)) return;
    setReported((r) => new Set(r).add(id));
    try { await reportCourseFeedback({ data: { id } }); } catch { /* best-effort */ }
  };

  const copyLink = () => {
    if (!deleteLink) return;
    navigator.clipboard?.writeText(deleteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => { /* clipboard may be unavailable */ });
  };

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg">
          {tr(lang, { en: "Feedback", no: "Tilbakemeldinger", sv: "Feedback", de: "Feedback", pl: "Opinie" })}
          {average !== null && (
            <span className="ml-2 text-sm text-gold font-normal">
              {average.toFixed(1)} / 5 ({count})
            </span>
          )}
        </h3>
        {!open && status !== "done" && (
          <button onClick={() => setOpen(true)} className="text-sm px-3 py-1.5 rounded-md border border-border hover:border-gold/50 transition">
            {tr(lang, { en: "Leave feedback", no: "Gi tilbakemelding", sv: "Lämna feedback", de: "Feedback geben", pl: "Zostaw opinię" })}
          </button>
        )}
      </div>

      {entries.length > 0 && (
        <ul className="space-y-3 mb-6">
          {entries.map((e) => (
            <li key={e.id} className="bg-card/40 border border-border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`size-3.5 ${i < e.rating ? "fill-gold text-gold" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <button
                  onClick={() => report(e.id)}
                  disabled={reported.has(e.id)}
                  aria-label={tr(lang, { en: "Report", no: "Rapporter", sv: "Rapportera", de: "Melden", pl: "Zgłoś" })}
                  className="text-muted-foreground/60 hover:text-destructive disabled:opacity-40 transition"
                >
                  <Flag className="size-3.5" />
                </button>
              </div>
              {e.comment && <p className="text-sm text-foreground/90 mt-1.5">{e.comment}</p>}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {e.display_name && <span>{e.display_name}</span>}
                {e.country && <span>· {e.country}</span>}
                {e.adjust_chips.map((c, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded-full bg-background border border-border">{c}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {open && status !== "done" && (
        <div className="bg-card/40 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} star`}>
                <Star className={`size-6 transition ${i < rating ? "fill-gold text-gold" : "text-muted-foreground hover:text-gold/60"}`} />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setWorked(true)} className={`px-3 py-1.5 rounded-md text-xs border transition ${worked === true ? "bg-gold text-primary-foreground border-gold" : "border-border hover:border-gold/50"}`}>
              {tr(lang, { en: "This worked for me", no: "Dette fungerte for meg", sv: "Det här fungerade för mig", de: "Das hat für mich funktioniert", pl: "To u mnie zadziałało" })}
            </button>
            <button type="button" onClick={() => setWorked(false)} className={`px-3 py-1.5 rounded-md text-xs border transition ${worked === false ? "bg-gold text-primary-foreground border-gold" : "border-border hover:border-gold/50"}`}>
              {tr(lang, { en: "It didn't", no: "Det gjorde det ikke", sv: "Det gjorde det inte", de: "Hat nicht funktioniert", pl: "Nie zadziałało" })}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ADJUST_CHIPS.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleChip(i)}
                className={`px-2.5 py-1 rounded-full text-xs border transition ${chips.has(i) ? "bg-gold/20 border-gold text-gold" : "border-border text-muted-foreground hover:border-gold/40"}`}
              >
                {c[lang] ?? c.en}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder={tr(lang, { en: "Anything you want to tell us (optional)", no: "Noe du vil fortelle oss (valgfritt)", sv: "Något du vill berätta för oss (valfritt)", de: "Etwas, das du uns sagen möchtest (optional)", pl: "Coś, co chcesz nam powiedzieć (opcjonalnie)" })}
            className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
          />

          <div className="grid sm:grid-cols-2 gap-2">
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} placeholder={tr(lang, { en: "Name (optional)", no: "Navn (valgfritt)", sv: "Namn (valfritt)", de: "Name (optional)", pl: "Imię (opcjonalnie)" })} className="px-3 py-2 rounded-md bg-background border border-border text-sm" />
            <input value={country} onChange={(e) => setCountry(e.target.value)} maxLength={80} placeholder={tr(lang, { en: "Country (optional)", no: "Land (valgfritt)", sv: "Land (valfritt)", de: "Land (optional)", pl: "Kraj (opcjonalnie)" })} className="px-3 py-2 rounded-md bg-background border border-border text-sm" />
          </div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" maxLength={255} placeholder={tr(lang, { en: "Email (optional, never shown publicly)", no: "E-post (valgfritt, vises aldri offentlig)", sv: "E-post (valfritt, visas aldrig offentligt)", de: "E-Mail (optional, nie öffentlich sichtbar)", pl: "E-mail (opcjonalnie, nigdy nie jest publiczny)" })} className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm" />

          {/* Honeypot — hidden from real visitors via CSS, not display:none (some bots skip those) */}
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] w-px h-px opacity-0"
          />

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={consentPublic} onChange={(e) => setConsentPublic(e.target.checked)} className="mt-0.5 accent-gold" />
            {tr(lang, {
              en: "Show my rating and comment publicly on this page (your email is never shown).",
              no: "Vis vurderingen og kommentaren min offentlig på denne siden (e-posten min vises aldri).",
              sv: "Visa mitt betyg och min kommentar offentligt på den här sidan (min e-post visas aldrig).",
              de: "Meine Bewertung und meinen Kommentar öffentlich auf dieser Seite zeigen (meine E-Mail wird nie angezeigt).",
              pl: "Pokaż moją ocenę i komentarz publicznie na tej stronie (mój e-mail nigdy nie jest widoczny).",
            })}
          </label>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={privateToEditor} onChange={(e) => setPrivateToEditor(e.target.checked)} className="mt-0.5 accent-gold" />
            {tr(lang, {
              en: "Keep this private — only the editor sees it, never shown publicly even if checked above.",
              no: "Hold dette privat — kun redaktøren ser det, vises aldri offentlig selv om avkrysset over.",
              sv: "Håll detta privat — endast redaktören ser det, visas aldrig offentligt även om ovan är ikryssat.",
              de: "Das privat halten — nur der Redakteur sieht es, wird nie öffentlich gezeigt, auch wenn oben angehakt.",
              pl: "Zachowaj to prywatnie — widzi to tylko redaktor, nigdy nie jest publiczne, nawet jeśli zaznaczono powyżej.",
            })}
          </label>

          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
            {tr(lang, {
              en: "We store your rating, comment and the details above to improve this course. See our Privacy Policy for what's kept and how to remove it — you'll also get a one-time delete link after submitting.",
              no: "Vi lagrer vurderingen, kommentaren og opplysningene over for å forbedre kurset. Se personvernerklæringen for hva som lagres og hvordan du fjerner det — du får også en engangslenke for sletting etter innsending.",
              sv: "Vi sparar ditt betyg, din kommentar och uppgifterna ovan för att förbättra kursen. Se vår integritetspolicy för vad som sparas och hur du tar bort det — du får även en engångslänk för radering efter att du skickat in.",
              de: "Wir speichern deine Bewertung, deinen Kommentar und die obigen Angaben, um diesen Kurs zu verbessern. Siehe unsere Datenschutzerklärung für Details und wie du sie entfernst — du erhältst nach dem Absenden auch einen einmaligen Löschlink.",
              pl: "Przechowujemy Twoją ocenę, komentarz i powyższe dane, aby ulepszyć ten kurs. Zobacz naszą politykę prywatności, co jest przechowywane i jak to usunąć — po wysłaniu otrzymasz też jednorazowy link do usunięcia.",
            })}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={rating < 1 || status === "busy"}
              className="px-5 py-2 rounded-md bg-gold text-primary-foreground text-sm font-medium hover:bg-gold/90 disabled:opacity-40 transition"
            >
              {tr(lang, { en: "Submit", no: "Send inn", sv: "Skicka in", de: "Absenden", pl: "Wyślij" })}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
              {tr(lang, { en: "Cancel", no: "Avbryt", sv: "Avbryt", de: "Abbrechen", pl: "Anuluj" })}
            </button>
            {status === "error" && <span className="text-xs text-destructive">{tr(lang, { en: "Something went wrong.", no: "Noe gikk galt.", sv: "Något gick fel.", de: "Etwas ist schiefgelaufen.", pl: "Coś poszło nie tak." })}</span>}
          </div>
        </div>
      )}

      {status === "done" && (
        <div className="bg-card/40 border border-gold/40 rounded-lg p-4">
          <p className="text-sm text-gold mb-2">
            {tr(lang, { en: "Thanks — that's in.", no: "Takk — det er registrert.", sv: "Tack — det är inskickat.", de: "Danke — angekommen.", pl: "Dzięki — zapisano." })}
          </p>
          {deleteLink && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{tr(lang, { en: "Save this link to delete your feedback later:", no: "Lagre denne lenken for å slette tilbakemeldingen senere:", sv: "Spara den här länken för att ta bort din feedback senare:", de: "Speichere diesen Link, um dein Feedback später zu löschen:", pl: "Zapisz ten link, aby później usunąć swoją opinię:" })}</span>
              <button onClick={copyLink} className="inline-flex items-center gap-1 text-gold hover:underline shrink-0">
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {tr(lang, { en: "Copy", no: "Kopiér", sv: "Kopiera", de: "Kopieren", pl: "Kopiuj" })}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
