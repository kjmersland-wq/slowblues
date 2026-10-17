import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import {
  getTraffic,
  type TrafficData,
  type TrafficPeriod,
  type TrafficRow,
} from "@/lib/traffic.functions";

export const Route = createFileRoute("/admin/traffic")({
  component: AdminTrafficPage,
  head: () => ({
    meta: [{ title: "Trafikk — SlowBlues" }, { name: "robots", content: "noindex" }],
  }),
});

const PERIODS: TrafficPeriod[] = [7, 28, 90];
const nf = new Intl.NumberFormat("nb-NO");

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobil",
  tablet: "Nettbrett",
  desktop: "Datamaskin",
};

function AdminTrafficPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [days, setDays] = useState<TrafficPeriod>(28);
  const [site, setSite] = useState<string>("");
  const [data, setData] = useState<TrafficData | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    setBusy(true);
    setErr(null);
    getTraffic({ data: { site: site || undefined, days } })
      .then((next) => {
        if (!active) return;
        setData(next);
        // Follow the server's choice when nothing (valid) was picked yet.
        if (next.site && next.site !== site) setSite(next.site);
      })
      .catch(() => {
        if (active) setErr("Kunne ikke laste trafikkdata. Sjekk at du har admin-tilgang.");
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [isAdmin, site, days]);

  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(["nb"], { type: "region" });
    } catch {
      return null;
    }
  }, []);

  if (loading) {
    return (
      <PageShell hideMerchCta>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">
          Laster…
        </div>
      </PageShell>
    );
  }

  const countryLabel = (code: string | null) => {
    if (!code) return "Ukjent";
    try {
      return regionNames?.of(code) ?? code;
    } catch {
      return code;
    }
  };

  return (
    <PageShell hideMerchCta>
      <PageHero
        eyebrow="Admin"
        title="Trafikk"
        lead="Anonym og cookie-fri måling av sidevisninger."
        img={IMG.pianoNight}
      />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-gold">
            ← Admin
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <select
            value={site}
            onChange={(e) => setSite(e.target.value)}
            aria-label="Nettsted"
            disabled={!data || data.sites.length === 0}
            className="w-full sm:w-auto sm:min-w-56 px-3 py-2 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-gold"
          >
            {(data?.sites ?? []).map((s) => (
              <option key={s.site} value={s.site}>
                {s.site} ({nf.format(s.views)})
              </option>
            ))}
            {(!data || data.sites.length === 0) && <option value="">Ingen nettsteder ennå</option>}
          </select>

          <div className="grid grid-cols-3 gap-2 sm:flex" role="group" aria-label="Periode">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setDays(p)}
                aria-pressed={days === p}
                className={`px-4 py-2 rounded-md text-sm ${days === p ? "bg-gold text-primary-foreground" : "border border-border hover:border-gold"}`}
              >
                {p} dager
              </button>
            ))}
          </div>

          {busy && <span className="text-xs text-muted-foreground">Laster…</span>}
        </div>

        {err && <p className="mb-6 text-sm text-destructive">{err}</p>}

        {data && data.site === null && !err && (
          <p className="text-muted-foreground">
            Ingen sidevisninger registrert de siste {data.days} dagene. Tellingen starter så snart{" "}
            <code>/tracker.js</code> er i bruk og <code>/api/collect</code> mottar data.
          </p>
        )}

        {data && data.site && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <Stat label="Besøkende" hint="unike per dag" value={data.totals.visitors} />
              <Stat label="Sidevisninger" value={data.totals.views} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Panel title="Topp-sider" rows={data.pages} mono />
              <Panel title="Kilder" rows={data.sources} empty="Direkte / ukjent" />
              <Panel title="Land" rows={data.countries} empty="Ukjent" format={countryLabel} />
              <Panel
                title="Enheter"
                rows={data.devices}
                empty="Ukjent"
                format={(v) => (v ? (DEVICE_LABELS[v] ?? v) : "Ukjent")}
              />
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              Ingen cookies, ingen IP-adresser lagret. «Besøkende» teller unike anonyme besøkende
              per dag, summert over perioden. Tidspunkt i UTC.
            </p>
          </>
        )}
      </section>
    </PageShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="bg-card/60 border border-border rounded-lg p-4">
      <div className="text-xs uppercase tracking-wider text-gold">{label}</div>
      <div className="mt-1 text-3xl font-display font-bold tabular-nums">{nf.format(value)}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Panel({
  title,
  rows,
  empty = "Ukjent",
  mono,
  format,
}: {
  title: string;
  rows: TrafficRow[];
  empty?: string;
  mono?: boolean;
  format?: (label: string | null) => string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  return (
    <div className="bg-card/60 border border-border rounded-lg p-4 min-w-0">
      <h2 className="text-sm font-medium mb-3">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingen data.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const label = format ? format(r.label) : (r.label ?? empty);
            return (
              <li key={r.label ?? "__none"} className="text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`truncate ${mono ? "font-mono text-xs" : ""}`} title={label}>
                    {label}
                  </span>
                  <span className="tabular-nums text-muted-foreground shrink-0">
                    {nf.format(r.views)}
                  </span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-border/60 overflow-hidden">
                  <div
                    className="h-full bg-gold/70"
                    style={{ width: `${(r.views / max) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
