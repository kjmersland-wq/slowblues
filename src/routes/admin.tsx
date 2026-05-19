import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { Trash2, LogOut, MessageSquare, BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

type Guest = { id: string; name: string; location: string | null; message: string; created_at: string };
type Contact = { id: string; name: string; email: string; message: string; created_at: string };

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"guestbook" | "contact">("guestbook");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const refresh = async () => {
    setBusy(true);
    setErr(null);
    const [g, c] = await Promise.all([
      supabase.from("guestbook_entries").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    if (g.error || c.error) setErr("Kunne ikke laste data. Sjekk at du har admin-tilgang.");
    setGuests((g.data ?? []) as Guest[]);
    setContacts((c.data ?? []) as Contact[]);
    setBusy(false);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  const delGuest = async (id: string) => {
    if (!confirm("Slette dette innlegget?")) return;
    const { error } = await supabase.from("guestbook_entries").delete().eq("id", id);
    if (error) setErr("Sletting feilet.");
    else setGuests((l) => l.filter((x) => x.id !== id));
  };

  const delContact = async (id: string) => {
    if (!confirm("Slette denne meldingen?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) setErr("Sletting feilet.");
    else setContacts((l) => l.filter((x) => x.id !== id));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div></PageShell>;

  if (user && !isAdmin) {
    return (
      <PageShell>
        <PageHero eyebrow="Admin" title="Ingen tilgang" lead="Kontoen din har ikke admin-rolle." img={IMG.pianoNight} />
        <div className="max-w-md mx-auto px-6 pb-16 text-center">
          <button onClick={logout} className="px-5 py-2.5 rounded-md border border-border hover:border-gold">Logg ut</button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="Moderasjonspanel" lead={`Innlogget som ${user?.email}`} img={IMG.pianoNight} />
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button onClick={() => setTab("guestbook")} className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${tab === "guestbook" ? "bg-gold text-primary-foreground" : "border border-border"}`}>
              <BookOpen className="size-4" /> Gjestebok ({guests.length})
            </button>
            <button onClick={() => setTab("contact")} className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 ${tab === "contact" ? "bg-gold text-primary-foreground" : "border border-border"}`}>
              <MessageSquare className="size-4" /> Kontakt ({contacts.length})
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={refresh} disabled={busy} className="px-4 py-2 rounded-md border border-border text-sm hover:border-gold disabled:opacity-60">Oppdater</button>
            <button onClick={logout} className="px-4 py-2 rounded-md border border-border text-sm hover:border-gold flex items-center gap-2">
              <LogOut className="size-4" /> Logg ut
            </button>
          </div>
        </div>

        {err && <p className="text-sm text-red-400 mb-4">{err}</p>}

        {tab === "guestbook" ? (
          <div className="space-y-3">
            {guests.length === 0 && !busy && <p className="text-sm text-muted-foreground text-center py-8">Ingen innlegg.</p>}
            {guests.map((e) => (
              <article key={e.id} className="bg-card/60 border border-border rounded-lg p-5 flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-display text-lg text-gold">{e.name}</span>
                    {e.location && <span className="text-xs text-muted-foreground">{e.location}</span>}
                    <span className="text-xs text-muted-foreground ml-auto">{new Date(e.created_at).toLocaleString("no-NO")}</span>
                  </div>
                  <p className="text-sm text-foreground/85 italic">"{e.message}"</p>
                </div>
                <button onClick={() => delGuest(e.id)} className="self-start p-2 rounded-md border border-border hover:border-red-500 hover:text-red-400">
                  <Trash2 className="size-4" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.length === 0 && !busy && <p className="text-sm text-muted-foreground text-center py-8">Ingen meldinger.</p>}
            {contacts.map((m) => (
              <article key={m.id} className="bg-card/60 border border-border rounded-lg p-5 flex gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-display text-lg text-gold">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="text-sm text-foreground/80 hover:text-gold">{m.email}</a>
                    <span className="text-xs text-muted-foreground ml-auto">{new Date(m.created_at).toLocaleString("no-NO")}</span>
                  </div>
                  <p className="text-sm text-foreground/85 whitespace-pre-wrap">{m.message}</p>
                  <a href={`mailto:${m.email}?subject=Re: SlowBlues`} className="mt-3 inline-block text-xs text-gold hover:underline">Svar via e-post →</a>
                </div>
                <button onClick={() => delContact(m.id)} className="self-start p-2 rounded-md border border-border hover:border-red-500 hover:text-red-400">
                  <Trash2 className="size-4" />
                </button>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-muted-foreground text-center">
          <Link to="/" className="hover:text-gold">← Tilbake til SlowBlues</Link>
        </p>
      </section>
    </PageShell>
  );
}
