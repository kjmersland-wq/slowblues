import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { deleteCourseFeedbackByToken } from "@/lib/courseFeedback.functions";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/learn/play/feedback/delete/$token")({
  component: DeleteFeedbackPage,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }, { title: "Delete feedback — SlowBlues" }] }),
});

function DeleteFeedbackPage() {
  const { lang } = useI18n();
  const { token } = useParams({ from: "/learn/play/feedback/delete/$token" });
  const [state, setState] = useState<"idle" | "busy" | "done" | "not_found" | "error">("idle");

  const confirm = async () => {
    setState("busy");
    try {
      const res = await deleteCourseFeedbackByToken({ data: { token } });
      setState(res.ok ? "done" : "not_found");
    } catch {
      setState("error");
    }
  };

  return (
    <PageShell hideMerchCta>
      <PageHero
        eyebrow={tr(lang, { en: "Learn to Play", no: "Spill blues", sv: "Spela blues", de: "Blues spielen", pl: "Graj bluesa" })}
        title={tr(lang, { en: "Delete your feedback", no: "Slett tilbakemeldingen din", sv: "Ta bort din feedback", de: "Dein Feedback löschen", pl: "Usuń swoją opinię" })}
        lead=""
      />
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        {state === "idle" && (
          <>
            <p className="text-muted-foreground mb-6">
              {tr(lang, {
                en: "This removes your rating and comment permanently. This can't be undone.",
                no: "Dette fjerner vurderingen og kommentaren din permanent. Dette kan ikke angres.",
                sv: "Detta tar bort ditt betyg och din kommentar permanent. Det går inte att ångra.",
                de: "Damit werden deine Bewertung und dein Kommentar dauerhaft entfernt. Das kann nicht rückgängig gemacht werden.",
                pl: "To trwale usunie Twoją ocenę i komentarz. Tego nie można cofnąć.",
              })}
            </p>
            <button onClick={confirm} className="px-6 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
              {tr(lang, { en: "Delete my feedback", no: "Slett tilbakemeldingen min", sv: "Ta bort min feedback", de: "Mein Feedback löschen", pl: "Usuń moją opinię" })}
            </button>
          </>
        )}
        {state === "busy" && <p className="text-muted-foreground">{tr(lang, { en: "Deleting…", no: "Sletter…", sv: "Tar bort…", de: "Wird gelöscht…", pl: "Usuwanie…" })}</p>}
        {state === "done" && (
          <p className="text-gold">{tr(lang, { en: "Done — your feedback has been deleted.", no: "Ferdig — tilbakemeldingen din er slettet.", sv: "Klart — din feedback har tagits bort.", de: "Erledigt — dein Feedback wurde gelöscht.", pl: "Gotowe — Twoja opinia została usunięta." })}</p>
        )}
        {state === "not_found" && (
          <p className="text-muted-foreground">{tr(lang, { en: "This link has already been used or isn't valid.", no: "Denne lenken er allerede brukt eller er ikke gyldig.", sv: "Den här länken har redan använts eller är inte giltig.", de: "Dieser Link wurde bereits verwendet oder ist ungültig.", pl: "Ten link został już użyty lub jest nieprawidłowy." })}</p>
        )}
        {state === "error" && (
          <p className="text-destructive">{tr(lang, { en: "Something went wrong — please try again.", no: "Noe gikk galt — prøv igjen.", sv: "Något gick fel — försök igen.", de: "Etwas ist schiefgelaufen — bitte versuch es erneut.", pl: "Coś poszło nie tak — spróbuj ponownie." })}</p>
        )}
        <Link to="/learn/play" className="mt-8 inline-block text-sm text-muted-foreground hover:text-gold">
          {tr(lang, { en: "Back to Learn to Play", no: "Tilbake til Spill blues", sv: "Tillbaka till Spela blues", de: "Zurück zu Blues spielen", pl: "Powrót do Graj bluesa" })}
        </Link>
      </section>
    </PageShell>
  );
}
