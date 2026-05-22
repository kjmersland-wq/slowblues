import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Logg inn — SlowBlues" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e: any) {
      setErr(e.message ?? "Noe gikk galt");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="Logg inn" lead="Tilgang for moderatorer av SlowBlues." img={IMG.pianoNight} />
      <section className="max-w-md mx-auto px-6 py-12">
        <form onSubmit={submit} className="bg-card/60 border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">E-post</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">Passord</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button disabled={busy} className="w-full px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-60">
            {busy ? "Jobber…" : mode === "signup" ? "Opprett konto" : "Logg inn"}
          </button>
          <p className="text-xs text-muted-foreground">
            Den første registrerte kontoen blir automatisk administrator.
            <br />
            <Link to="/" className="text-gold hover:underline">← Tilbake til forsiden</Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
