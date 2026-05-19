import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { fetchNewsletterArchive } from "@/lib/mailerlite.functions";
import { IMG } from "@/data/images";
import { Mail, Calendar, ArrowRight } from "lucide-react";
import logoSB from "@/assets/logo-slowblues.png";

export const Route = createFileRoute("/newsletter")({
  component: NewsletterArchivePage,
  head: () => ({
    meta: [
      { title: "Newsletter Archive — SlowBlues" },
      {
        name: "description",
        content:
          "Every Monday evening: a personal letter from SlowBlues on new blues releases, festivals, artist news and the people who keep the music alive.",
      },
      { property: "og:title", content: "Newsletter Archive — SlowBlues" },
      { property: "og:image", content: IMG.microphone },
    ],
  }),
});

function fmtDate(s: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function NewsletterArchivePage() {
  const fetchArchive = useServerFn(fetchNewsletterArchive);
  const { data, isLoading, error } = useQuery({
    queryKey: ["newsletter-archive"],
    queryFn: () => fetchArchive(),
    staleTime: 5 * 60 * 1000,
  });

  const items = data?.items ?? [];

  return (
    <PageShell>
      <PageHero
        eyebrow="Monday Letter · 21:00 CET"
        title="The SlowBlues Letter"
        lead="A weekly note from the founder — new releases, festival reports, artist stories and the obituaries we'd rather not write. Sent every Monday evening."
        img={IMG.microphone}
      />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <SignupCard />
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <Mail className="size-5 text-gold" />
          <h2 className="font-display text-2xl">Archive</h2>
          <span className="text-xs text-muted-foreground">English only — never translated.</span>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading the archive…</p>}
        {error && (
          <p className="text-sm text-muted-foreground">
            The archive couldn't load right now. Try again in a moment.
          </p>
        )}
        {!isLoading && !error && items.length === 0 && (
          <div className="rounded-lg border border-border bg-card/40 p-6 text-sm text-muted-foreground">
            No letters in the archive yet. The first edition lands soon — subscribe above to receive it Monday at 21:00 CET.
          </div>
        )}

        <ul className="divide-y divide-border">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                to="/newsletter/$id"
                params={{ id: it.id }}
                className="group block py-6 hover:bg-card/40 -mx-4 px-4 rounded-md transition"
              >
                <div className="flex items-center gap-3 text-[10px] tracking-[0.25em] text-gold uppercase mb-2">
                  <Calendar className="size-3" /> {fmtDate(it.sentAt)}
                </div>
                <h3 className="font-display text-2xl mb-1 leading-tight group-hover:text-gold transition">
                  {it.subject}
                </h3>
                {it.previewText && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {it.previewText}
                  </p>
                )}
                <div className="mt-3 text-sm text-gold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read the letter <ArrowRight className="size-4" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

function SignupCard() {
  return <SignupForm />;
}

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/mailerlite.functions";

function SignupForm() {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await subscribe({ data: { email, name: name || undefined } });
      if (res.ok) {
        setState("ok");
        setMsg("You're on the list. The next letter lands Monday at 21:00 CET.");
        setEmail("");
        setName("");
      } else {
        setState("err");
        setMsg(res.error);
      }
    } catch {
      setState("err");
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-card to-card/30 p-8">
      <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">Subscribe</div>
      <h2 className="font-display text-3xl mb-2">A weekly letter, written by hand.</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-xl">
        One email a week, in English, from one human who loves the blues. No marketing noise.
        Unsubscribe with one click.
      </p>
      <form onSubmit={onSubmit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={100}
          className="px-4 py-2.5 rounded-md bg-background border border-border focus:border-gold outline-none text-sm"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          maxLength={255}
          className="px-4 py-2.5 rounded-md bg-background border border-border focus:border-gold outline-none text-sm"
        />
        <button
          disabled={state === "loading"}
          className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 text-sm disabled:opacity-60"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      {state === "ok" && <p className="mt-3 text-sm text-gold">{msg}</p>}
      {state === "err" && <p className="mt-3 text-sm text-destructive">{msg}</p>}
      <p className="mt-3 text-xs text-muted-foreground">
        Sent through MailerLite. Your address is never shared.
      </p>
    </div>
  );
}
