import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { SUPPORTED_LOCALES, artistDetailPath, artistsListPath, DEFAULT_LOCALE } from "@/lib/locale";

const BASE_URL = "https://www.slowblues.no";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data: artists } = await supabase
          .from("artists")
          .select("slug, updated_at")
          .order("name", { ascending: true });

        const staticPaths = [
          "/", "/artists", "/blog", "/history", "/styles", "/festivals",
          "/worldmap", "/radio", "/gallery", "/instruments", "/watch", "/listen",
          "/compare", "/learn/gear", "/learn/styles", "/experience/media",
          "/about", "/about/blog", "/about/merch", "/about/guestbook", "/about/advertise",
          "/guestbook",
          "/contact", "/support", "/newsletter", "/quiz", "/quiz/archive", "/updates",
          "/accessibility", "/privacy", "/cookies", "/terms", "/gdpr", "/copyright", "/disclaimer",
        ];
        const urls: string[] = [];

        for (const p of staticPaths) {
          urls.push(
            `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`,
          );
        }

        // Artist list per locale
        for (const loc of SUPPORTED_LOCALES) {
          const path = artistsListPath(loc);
          const alts = SUPPORTED_LOCALES.map(
            (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${artistsListPath(l)}" />`,
          ).join("\n");
          urls.push(
            `  <url>\n    <loc>${BASE_URL}${path}</loc>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${artistsListPath(DEFAULT_LOCALE)}" />\n    <changefreq>weekly</changefreq>\n  </url>`,
          );
        }

        // One <url> per artist per locale, each carrying hreflang alternates
        for (const a of artists ?? []) {
          for (const loc of SUPPORTED_LOCALES) {
            const path = artistDetailPath(loc, a.slug);
            const lastmod = a.updated_at ? new Date(a.updated_at).toISOString().slice(0, 10) : undefined;
            const alts = SUPPORTED_LOCALES.map(
              (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${artistDetailPath(l, a.slug)}" />`,
            ).join("\n");
            urls.push(
              `  <url>\n    <loc>${BASE_URL}${path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${artistDetailPath(DEFAULT_LOCALE, a.slug)}" />\n  </url>`,
            );
          }
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
