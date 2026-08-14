import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe2, Share2, BookmarkPlus, ExternalLink, Copy, Check, Facebook, Send, MessageCircle } from "lucide-react";
import { useI18n, type Lang } from "@/i18n";

const STORAGE_KEY = "slowblues-migration-popup-v1";
const NEW_URL = "https://Slow-Blues.com";

type Copy = {
  title: string;
  greeting: string;
  intro: string;
  reason: string;
  newChapter: string;
  polishAdded: string;
  bookmarkAsk: string;
  shareAsk: string;
  thanks: string;
  signature: string;
  polishBadge: string;
  polishNote: string;
  dontShow: string;
  close: string;
  visit: string;
  share: string;
  bookmark: string;
  shareHeading: string;
  shareMessage: string;
  copyLink: string;
  copied: string;
  bookmarkHint: string;
  personalNote: string;
};

const COPY: Record<Lang, Copy> = {
  en: {
    title: "A New Chapter for Slow-Blues",
    greeting: "Hello friends,",
    intro: "I want to personally let you know that SlowBlues.no has now officially moved to our new international home: Slow-Blues.com.",
    reason: "The reason is simple: I am moving from Norway to Warsaw, Poland, and because of this I can no longer continue using the Norwegian .no domain.",
    newChapter: "At the same time, this opens a new and exciting chapter for Slow-Blues as a more international blues platform.",
    polishAdded: "I'm also very happy to now offer Polish language support on the website.",
    bookmarkAsk: "If you have bookmarked the old website on your phone, tablet or computer, I kindly ask you to update your bookmark to the new address.",
    shareAsk: "And if you know other blues lovers who still use the old domain, I would truly appreciate if you shared the news with them as well.",
    thanks: "Thank you so much for being part of this journey.",
    signature: "— Kjell Mersland",
    polishBadge: "Now available in Polish",
    polishNote: "I have now also added Polish language support to the website as part of the move to Warsaw, Poland.",
    dontShow: "Don't show this again",
    close: "Close",
    visit: "Visit Slow-Blues.com",
    share: "Share the news",
    bookmark: "Update bookmark",
    shareHeading: "Share with fellow blues fans",
    shareMessage: "SlowBlues.no has moved to the new international domain: https://Slow-Blues.com — Please update your bookmarks and share with fellow blues fans.",
    copyLink: "Copy link",
    copied: "Copied!",
    bookmarkHint: "Press Ctrl+D (or ⌘+D on Mac) to bookmark this page.",
    personalNote: "A personal note",
  },
  no: {
    title: "Et nytt kapittel for Slow-Blues",
    greeting: "Hei venner,",
    intro: "Jeg vil personlig fortelle dere at SlowBlues.no nå offisielt har flyttet til vårt nye internasjonale hjem: Slow-Blues.com.",
    reason: "Grunnen er enkel: Jeg flytter fra Norge til Warszawa i Polen, og kan derfor ikke lenger bruke det norske .no-domenet.",
    newChapter: "Samtidig åpner dette et nytt og spennende kapittel for Slow-Blues som en mer internasjonal blues-plattform.",
    polishAdded: "Jeg er også veldig glad for nå å kunne tilby polsk språkstøtte på nettsiden.",
    bookmarkAsk: "Hvis du har bokmerket den gamle nettsiden på telefon, nettbrett eller PC, ber jeg deg vennligst oppdatere bokmerket til den nye adressen.",
    shareAsk: "Og hvis du kjenner andre blueselskere som fortsatt bruker det gamle domenet, hadde jeg satt enormt pris på om du delte nyheten med dem også.",
    thanks: "Tusen takk for at du er en del av denne reisen.",
    signature: "— Kjell Mersland",
    polishBadge: "Nå tilgjengelig på polsk",
    polishNote: "Jeg har nå også lagt til polsk språkstøtte på nettsiden, som en del av flyttingen til Warszawa i Polen.",
    dontShow: "Ikke vis dette igjen",
    close: "Lukk",
    visit: "Besøk Slow-Blues.com",
    share: "Del nyheten",
    bookmark: "Oppdater bokmerke",
    shareHeading: "Del med andre bluesvenner",
    shareMessage: "SlowBlues.no har flyttet til det nye internasjonale domenet: https://Slow-Blues.com — Vennligst oppdater bokmerkene dine og del med andre bluesvenner.",
    copyLink: "Kopier lenke",
    copied: "Kopiert!",
    bookmarkHint: "Trykk Ctrl+D (eller ⌘+D på Mac) for å bokmerke denne siden.",
    personalNote: "En personlig hilsen",
  },
  sv: {
    title: "Ett nytt kapitel för Slow-Blues",
    greeting: "Hej vänner,",
    intro: "Jag vill personligen berätta att SlowBlues.no nu officiellt har flyttat till vårt nya internationella hem: Slow-Blues.com.",
    reason: "Anledningen är enkel: Jag flyttar från Norge till Warszawa i Polen, och kan därför inte längre använda det norska .no-domänet.",
    newChapter: "Samtidigt öppnar detta ett nytt och spännande kapitel för Slow-Blues som en mer internationell bluesplattform.",
    polishAdded: "Jag är också väldigt glad att nu kunna erbjuda polsk språkstöd på webbplatsen.",
    bookmarkAsk: "Om du har bokmärkt den gamla webbplatsen på telefon, surfplatta eller dator ber jag dig vänligen uppdatera ditt bokmärke till den nya adressen.",
    shareAsk: "Och om du känner andra blueselskare som fortfarande använder den gamla domänen skulle jag verkligen uppskatta om du delade nyheten med dem också.",
    thanks: "Tack så mycket för att du är en del av denna resa.",
    signature: "— Kjell Mersland",
    polishBadge: "Nu tillgängligt på polska",
    polishNote: "Jag har nu också lagt till polskt språkstöd på webbplatsen, som en del av flytten till Warszawa i Polen.",
    dontShow: "Visa inte igen",
    close: "Stäng",
    visit: "Besök Slow-Blues.com",
    share: "Dela nyheten",
    bookmark: "Uppdatera bokmärke",
    shareHeading: "Dela med andra bluesvänner",
    shareMessage: "SlowBlues.no har flyttat till den nya internationella domänen: https://Slow-Blues.com — Vänligen uppdatera dina bokmärken och dela med andra bluesvänner.",
    copyLink: "Kopiera länk",
    copied: "Kopierad!",
    bookmarkHint: "Tryck Ctrl+D (eller ⌘+D på Mac) för att bokmärka denna sida.",
    personalNote: "En personlig hälsning",
  },
  de: {
    title: "Ein neues Kapitel für Slow-Blues",
    greeting: "Hallo Freunde,",
    intro: "Ich möchte euch persönlich mitteilen, dass SlowBlues.no nun offiziell in unser neues internationales Zuhause umgezogen ist: Slow-Blues.com.",
    reason: "Der Grund ist einfach: Ich ziehe von Norwegen nach Warschau in Polen und kann daher die norwegische .no-Domain nicht länger nutzen.",
    newChapter: "Gleichzeitig eröffnet dies ein neues und spannendes Kapitel für Slow-Blues als internationalere Blues-Plattform.",
    polishAdded: "Ich freue mich sehr, jetzt auch polnische Sprachunterstützung auf der Website anbieten zu können.",
    bookmarkAsk: "Wenn ihr die alte Website auf eurem Telefon, Tablet oder Computer als Lesezeichen gespeichert habt, bitte ich euch, das Lesezeichen auf die neue Adresse zu aktualisieren.",
    shareAsk: "Und wenn ihr andere Blues-Liebhaber kennt, die noch die alte Domain nutzen, würde ich es wirklich schätzen, wenn ihr die Nachricht auch mit ihnen teilen würdet.",
    thanks: "Vielen Dank, dass ihr Teil dieser Reise seid.",
    signature: "— Kjell Mersland",
    polishBadge: "Jetzt auf Polnisch verfügbar",
    polishNote: "Ich habe nun als Teil des Umzugs nach Warschau auch polnische Sprachunterstützung hinzugefügt.",
    dontShow: "Nicht mehr anzeigen",
    close: "Schließen",
    visit: "Slow-Blues.com besuchen",
    share: "Nachricht teilen",
    bookmark: "Lesezeichen aktualisieren",
    shareHeading: "Mit anderen Blues-Fans teilen",
    shareMessage: "SlowBlues.no ist auf die neue internationale Domain umgezogen: https://Slow-Blues.com — Bitte aktualisiere deine Lesezeichen und teile es mit anderen Blues-Fans.",
    copyLink: "Link kopieren",
    copied: "Kopiert!",
    bookmarkHint: "Drücke Strg+D (oder ⌘+D auf Mac), um diese Seite zu speichern.",
    personalNote: "Eine persönliche Nachricht",
  },
  pl: {
    title: "Nowy rozdział Slow-Blues",
    greeting: "Witajcie przyjaciele,",
    intro: "Chcę osobiście poinformować, że SlowBlues.no oficjalnie przeniosło się do swojego nowego, międzynarodowego domu: Slow-Blues.com.",
    reason: "Powód jest prosty: przeprowadzam się z Norwegii do Warszawy w Polsce i z tego powodu nie mogę dłużej korzystać z norweskiej domeny .no.",
    newChapter: "Jednocześnie otwiera to nowy i ekscytujący rozdział dla Slow-Blues jako bardziej międzynarodowej platformy bluesowej.",
    polishAdded: "Bardzo się cieszę, że mogę teraz zaoferować na stronie również wsparcie języka polskiego.",
    bookmarkAsk: "Jeśli masz starą stronę w zakładkach na telefonie, tablecie lub komputerze, proszę o zaktualizowanie zakładki na nowy adres.",
    shareAsk: "A jeśli znasz innych miłośników bluesa, którzy nadal używają starej domeny, byłbym bardzo wdzięczny, gdybyś podzielił się z nimi tą wiadomością.",
    thanks: "Bardzo dziękuję, że jesteście częścią tej podróży.",
    signature: "— Kjell Mersland",
    polishBadge: "Teraz dostępne po polsku",
    polishNote: "W ramach przeprowadzki do Warszawy dodałem teraz również wsparcie języka polskiego na stronie.",
    dontShow: "Nie pokazuj ponownie",
    close: "Zamknij",
    visit: "Odwiedź Slow-Blues.com",
    share: "Udostępnij wiadomość",
    bookmark: "Zaktualizuj zakładkę",
    shareHeading: "Podziel się z innymi fanami bluesa",
    shareMessage: "SlowBlues.no przeniosło się na nową międzynarodową domenę: https://Slow-Blues.com — Proszę o aktualizację zakładek i podzielenie się z innymi fanami bluesa.",
    copyLink: "Skopiuj link",
    copied: "Skopiowano!",
    bookmarkHint: "Naciśnij Ctrl+D (lub ⌘+D na Macu), aby dodać tę stronę do zakładek.",
    personalNote: "Osobista wiadomość",
  },
};

export function MigrationAnnouncement() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBookmarkHint, setShowBookmarkHint] = useState(false);

  const t = COPY[lang] ?? COPY.en;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const id = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(id);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    if (dontShow) {
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
    }
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(t.shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: "Slow-Blues.com", text: t.shareMessage, url: NEW_URL });
        return;
      } catch {}
    }
    setShowShare((s) => !s);
  };

  const handleBookmark = () => {
    setShowBookmarkHint(true);
    setTimeout(() => setShowBookmarkHint(false), 4500);
  };

  const shareText = encodeURIComponent(t.shareMessage);
  const shareUrl = encodeURIComponent(NEW_URL);

  const socials = [
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}` },
    { name: "X", icon: XIcon, href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}` },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${shareText}` },
    { name: "Messenger", icon: Send, href: `https://www.facebook.com/dialog/send?link=${shareUrl}&app_id=140586622674265&redirect_uri=${shareUrl}` },
    { name: "Telegram", icon: Send, href: `https://t.me/share/url?url=${shareUrl}&text=${shareText}` },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="migration-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-gold/30 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(212,175,55,0.25)]"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, rgba(60,30,30,0.55) 0%, rgba(12,16,32,0.98) 55%, rgba(8,10,22,1) 100%), linear-gradient(180deg, #0b1020 0%, #08091a 100%)",
            }}
          >
            {/* Noise overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.06] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
              }}
            />
            {/* Top ribbon glow */}
            <div aria-hidden className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #b91c1c 0%, transparent 70%)" }} />

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              aria-label={t.close}
              className="absolute top-3 right-3 z-10 p-2 rounded-full text-muted-foreground hover:text-gold hover:bg-gold/10 transition"
            >
              <X className="size-5" />
            </button>

            <div className="relative px-6 sm:px-10 pt-9 pb-7">
              {/* Eyebrow */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-gold/50" />
                <span className="text-[10px] tracking-[0.32em] uppercase text-gold/90">{t.personalNote}</span>
                <span className="h-px w-8 bg-gold/50" />
              </div>

              {/* Title */}
              <h2
                id="migration-title"
                className="font-display text-center text-3xl sm:text-4xl leading-tight bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(180deg, #f5e0a8 0%, #d4af37 55%, #a17a1f 100%)" }}
              >
                {t.title}
              </h2>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 mt-4 mb-5">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="size-1.5 rounded-full bg-gold/70" />
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
              </div>

              {/* Body */}
              <div className="space-y-3.5 text-[15px] leading-relaxed text-foreground/90">
                <p className="text-gold/90 font-medium">{t.greeting}</p>
                <p>{t.intro}</p>
                <p>{t.reason}</p>
                <p>{t.newChapter}</p>
                <p>{t.bookmarkAsk}</p>
                <p>{t.shareAsk}</p>
                <p className="text-foreground/95">{t.thanks}</p>
                <p
                  className="pt-1 font-display text-lg bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(180deg, #f5e0a8 0%, #d4af37 100%)" }}
                >
                  {t.signature}
                </p>
              </div>

              {/* Polish section */}
              <div
                className="mt-6 rounded-xl border border-gold/25 p-4 sm:p-5 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(185,28,28,0.08) 100%)",
                  boxShadow: "inset 0 0 30px rgba(212,175,55,0.06), 0 0 24px -8px rgba(212,175,55,0.2)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 size-9 rounded-full grid place-items-center bg-gold/15 border border-gold/30 text-gold">
                    <Globe2 className="size-4" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.28em] uppercase text-gold mb-1">{t.polishBadge}</div>
                    <p className="text-sm text-foreground/85 italic">"{t.polishNote}"</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href={NEW_URL}
                  className="group inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg font-semibold text-background transition-all hover:brightness-110 hover:shadow-[0_0_30px_-4px_rgba(212,175,55,0.6)]"
                  style={{ background: "linear-gradient(180deg, #e9c971 0%, #d4af37 55%, #9a7820 100%)" }}
                >
                  <ExternalLink className="size-4" />
                  {t.visit}
                </a>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition"
                  >
                    <Share2 className="size-4" />
                    {t.share}
                  </button>
                  <button
                    type="button"
                    onClick={handleBookmark}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-gold/40 hover:text-gold transition"
                  >
                    <BookmarkPlus className="size-4" />
                    {t.bookmark}
                  </button>
                </div>

                <AnimatePresence>
                  {showBookmarkHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-center text-gold/80 pt-1"
                    >
                      {t.bookmarkHint}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showShare && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl border border-border bg-black/30 p-4">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-gold/80 mb-3 text-center">
                          {t.shareHeading}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {socials.map((s) => (
                            <a
                              key={s.name}
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={s.name}
                              className="size-10 grid place-items-center rounded-full border border-gold/30 text-gold/90 hover:bg-gold/10 hover:border-gold/60 transition"
                            >
                              <s.icon className="size-4" />
                            </a>
                          ))}
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-2 px-3 h-10 rounded-full border border-gold/30 text-gold/90 hover:bg-gold/10 hover:border-gold/60 transition text-sm"
                          >
                            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                            <span>{copied ? t.copied : t.copyLink}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer controls */}
              <div className="mt-6 pt-4 border-t border-gold/15 flex items-center justify-between gap-3 flex-wrap">
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dontShow}
                    onChange={(e) => setDontShow(e.target.checked)}
                    className="size-4 rounded border-gold/40 bg-transparent accent-[#d4af37]"
                  />
                  {t.dontShow}
                </label>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21l-6.49 7.41L22 22h-6.797l-4.77-6.231L4.8 22H2.04l6.94-7.93L2 2h6.91l4.32 5.71L18.244 2zm-2.39 18h1.88L7.23 4H5.23l10.624 16z" />
    </svg>
  );
}
