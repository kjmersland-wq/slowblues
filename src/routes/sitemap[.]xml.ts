import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { SUPPORTED_LOCALES, artistDetailPath, artistsListPath, DEFAULT_LOCALE } from "@/lib/locale";
import { blogArticles } from "@/data/blogArticles";
import { FOUNDERS } from "@/data/gearFounders";

const BASE_URL = "https://www.slow-blues.com";

type Alt = { hreflang: string; path: string };

function buildUrl(opts: {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  alternates?: Alt[];
}): string {
  const lines: string[] = [`  <url>`, `    <loc>${BASE_URL}${opts.path}</loc>`];
  if (opts.lastmod) lines.push(`    <lastmod>${opts.lastmod}</lastmod>`);
  if (opts.changefreq) lines.push(`    <changefreq>${opts.changefreq}</changefreq>`);
  if (opts.priority) lines.push(`    <priority>${opts.priority}</priority>`);
  if (opts.alternates && opts.alternates.length) {
    for (const a of opts.alternates) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${BASE_URL}${a.path}" />`);
    }
  }
  lines.push(`  </url>`);
  return lines.join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [{ data: artists }, { data: reviews }, { data: concerts }] = await Promise.all([
          supabase.from("artists").select("slug, updated_at").order("name", { ascending: true }),
          supabase.from("blues_reviews").select("slug, updated_at").order("created_at", { ascending: false }),
          supabase.from("concerts").select("slug, updated_at").order("event_date", { ascending: false }),
        ]);

        const urls: string[] = [];

        // Home with hreflang declaring all supported languages (single canonical URL)
        urls.push(
          buildUrl({
            path: "/",
            changefreq: "daily",
            priority: "1.0",
            alternates: [
              ...SUPPORTED_LOCALES.map((l) => ({ hreflang: l, path: "/" })),
              { hreflang: "x-default", path: "/" },
            ],
          }),
        );

        // Static, single-locale pages
        const staticPaths: Array<{ p: string; cf?: string; pr?: string }> = [
          { p: "/artists", cf: "weekly", pr: "0.9" },
          { p: "/blog", cf: "weekly", pr: "0.8" },
          { p: "/history", cf: "monthly", pr: "0.7" },
          { p: "/styles", cf: "monthly", pr: "0.7" },
          { p: "/festivals", cf: "weekly", pr: "0.7" },
          { p: "/worldmap", cf: "monthly", pr: "0.6" },
          { p: "/radio", cf: "weekly", pr: "0.6" },
          { p: "/gallery", cf: "monthly", pr: "0.6" },
          { p: "/instruments", cf: "monthly", pr: "0.6" },
          { p: "/watch", cf: "weekly", pr: "0.6" },
          { p: "/listen", cf: "weekly", pr: "0.6" },
          { p: "/compare", cf: "monthly", pr: "0.5" },
          { p: "/learn/gear", cf: "monthly", pr: "0.7" },
          { p: "/learn/styles", cf: "monthly", pr: "0.6" },
          { p: "/experience/media", cf: "monthly", pr: "0.5" },
          { p: "/reviews", cf: "weekly", pr: "0.7" },
          { p: "/concerts", cf: "weekly", pr: "0.7" },
          { p: "/editorial/images", cf: "monthly", pr: "0.4" },
          { p: "/about", cf: "monthly", pr: "0.6" },
          { p: "/about/blog", cf: "monthly", pr: "0.5" },
          { p: "/about/merch", cf: "monthly", pr: "0.5" },
          { p: "/about/guestbook", cf: "monthly", pr: "0.4" },
          { p: "/guestbook", cf: "weekly", pr: "0.5" },
          { p: "/contact", cf: "yearly", pr: "0.4" },
          { p: "/support", cf: "yearly", pr: "0.4" },
          { p: "/newsletter", cf: "weekly", pr: "0.5" },
          { p: "/quiz", cf: "monthly", pr: "0.5" },
          { p: "/quiz/archive", cf: "monthly", pr: "0.4" },
          { p: "/updates", cf: "weekly", pr: "0.4" },
          { p: "/accessibility", cf: "yearly", pr: "0.3" },
          { p: "/privacy", cf: "yearly", pr: "0.3" },
          { p: "/cookies", cf: "yearly", pr: "0.3" },
          { p: "/terms", cf: "yearly", pr: "0.3" },
          { p: "/gdpr", cf: "yearly", pr: "0.3" },
          { p: "/copyright", cf: "yearly", pr: "0.3" },
          { p: "/disclaimer", cf: "yearly", pr: "0.3" },
        ];
        for (const s of staticPaths) {
          urls.push(buildUrl({ path: s.p, changefreq: s.cf, priority: s.pr }));
        }

        // /about/advertise has $locale variants → declare hreflang alternates
        for (const loc of SUPPORTED_LOCALES) {
          const prefix = loc === DEFAULT_LOCALE ? "" : `/${loc}`;
          urls.push(
            buildUrl({
              path: `${prefix}/about/advertise`,
              changefreq: "monthly",
              priority: "0.5",
              alternates: [
                ...SUPPORTED_LOCALES.map((l) => ({
                  hreflang: l,
                  path: `${l === DEFAULT_LOCALE ? "" : `/${l}`}/about/advertise`,
                })),
                { hreflang: "x-default", path: "/about/advertise" },
              ],
            }),
          );
        }

        // Artist list per locale with hreflang
        for (const loc of SUPPORTED_LOCALES) {
          urls.push(
            buildUrl({
              path: artistsListPath(loc),
              changefreq: "weekly",
              priority: "0.9",
              alternates: [
                ...SUPPORTED_LOCALES.map((l) => ({ hreflang: l, path: artistsListPath(l) })),
                { hreflang: "x-default", path: artistsListPath(DEFAULT_LOCALE) },
              ],
            }),
          );
        }

        // Artist detail per locale with hreflang + lastmod
        for (const a of artists ?? []) {
          const lastmod = a.updated_at ? new Date(a.updated_at).toISOString().slice(0, 10) : undefined;
          for (const loc of SUPPORTED_LOCALES) {
            urls.push(
              buildUrl({
                path: artistDetailPath(loc, a.slug),
                lastmod,
                changefreq: "monthly",
                priority: "0.7",
                alternates: [
                  ...SUPPORTED_LOCALES.map((l) => ({ hreflang: l, path: artistDetailPath(l, a.slug) })),
                  { hreflang: "x-default", path: artistDetailPath(DEFAULT_LOCALE, a.slug) },
                ],
              }),
            );
          }
        }

        // Blog posts (single-locale)
        for (const post of blogArticles) {
          urls.push(
            buildUrl({
              path: `/blog/${post.id}`,
              changefreq: "monthly",
              priority: "0.6",
            }),
          );
        }

        // Gear founder profiles
        for (const id of Object.keys(FOUNDERS)) {
          urls.push(
            buildUrl({
              path: `/learn/gear/${id}`,
              changefreq: "monthly",
              priority: "0.5",
            }),
          );
        }

        // Reviews
        for (const r of reviews ?? []) {
          if (!r.slug) continue;
          const lastmod = r.updated_at ? new Date(r.updated_at).toISOString().slice(0, 10) : undefined;
          urls.push(
            buildUrl({
              path: `/reviews/${r.slug}`,
              lastmod,
              changefreq: "monthly",
              priority: "0.6",
            }),
          );
        }

        // Concerts
        for (const c of concerts ?? []) {
          if (!c.slug) continue;
          const lastmod = c.updated_at ? new Date(c.updated_at).toISOString().slice(0, 10) : undefined;
          urls.push(
            buildUrl({
              path: `/concerts/${c.slug}`,
              lastmod,
              changefreq: "weekly",
              priority: "0.6",
            }),
          );
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
