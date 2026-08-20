import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider, useI18n, tr } from "@/i18n";
import { MigrationAnnouncement } from "@/components/MigrationAnnouncement";

function NotFoundComponent() {
  const { lang } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gold-gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">
          {tr(lang, { no: "Fant ikke siden", en: "Page not found", sv: "Sidan hittades inte", de: "Seite nicht gefunden", pl: "Nie znaleziono strony" })}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {tr(lang, {
            no: "Siden du leter etter finnes ikke, eller er flyttet.",
            en: "The page you're looking for doesn't exist or has been moved.",
            sv: "Sidan du letar efter finns inte, eller har flyttats.",
            de: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
            pl: "Strona, której szukasz, nie istnieje lub została przeniesiona.",
          })}
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            {tr(lang, { no: "Til forsiden", en: "Go home", sv: "Till startsidan", de: "Zur Startseite", pl: "Strona główna" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { lang } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          {tr(lang, { no: "Denne siden lastet ikke", en: "This page didn't load", sv: "Den här sidan gick inte att ladda", de: "Diese Seite konnte nicht geladen werden", pl: "Ta strona się nie wczytała" })}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tr(lang, { no: "Noe gikk galt hos oss.", en: "Something went wrong on our end.", sv: "Något gick fel hos oss.", de: "Bei uns ist etwas schiefgelaufen.", pl: "Coś poszło nie tak po naszej stronie." })}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            {tr(lang, { no: "Prøv igjen", en: "Try again", sv: "Försök igen", de: "Erneut versuchen", pl: "Spróbuj ponownie" })}
          </button>
          <a href="/" className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            {tr(lang, { no: "Til forsiden", en: "Go home", sv: "Till startsidan", de: "Zur Startseite", pl: "Strona główna" })}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "1s4Ig_bViTBVaJafjzP_SAdF2ICILJe9LM0efyxFULY" },
      { name: "google-site-verification", content: "LKSMqnEoH-9HEbLJOlcWtNrAUbGMzwE14C7UBBFHj1s" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "SlowBlues" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@slowblues" },
      { property: "og:image", content: "https://www.slow-blues.com/images/slow-blues-global-blues-encyclopedia-og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: "SlowBlues.com — Global Blues Encyclopedia. Live the blues. Discover more." },
      { name: "twitter:image", content: "https://www.slow-blues.com/images/slow-blues-global-blues-encyclopedia-og.jpg" },
      { name: "twitter:image:alt", content: "SlowBlues.com — Global Blues Encyclopedia. Live the blues. Discover more." },
    ],
    links: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://www.slow-blues.com/#organization",
              name: "KM TECH LABS",
              alternateName: "SlowBlues",
              legalName: "KM TECH LABS — Kjell Mersland",
              taxID: "934 044 029",
              vatID: "NO934044029",
              url: "https://www.slow-blues.com",
              founder: { "@type": "Person", name: "Kjell Mersland" },
              address: { "@type": "PostalAddress", addressCountry: "NO" },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "editorial",
                url: "https://www.slow-blues.com/contact",
                availableLanguage: ["Norwegian", "English", "German"],
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://www.slow-blues.com/#website",
              url: "https://www.slow-blues.com",
              name: "SlowBlues",
              description: "Redaksjonelt blues-arkiv med 330+ artistprofiler, historikk, anmeldelser og festivaler.",
              publisher: { "@id": "https://www.slow-blues.com/#organization" },
              inLanguage: ["no", "en", "de", "sv"],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// I18nProvider wraps `children` here (not inside RootComponent) so that it
// covers EVERY render path the root route can take, not just the happy-path
// `component`. TanStack Router's root Match renders `shellComponent` as the
// ancestor of both `component` and the `errorComponent`/`notFoundComponent`
// boundaries (they're siblings-in-fallback, not nested inside `component`'s
// own JSX) -- so a provider placed inside RootComponent, as this one used to
// be, is simply absent from the tree whenever an error or 404 boundary fires,
// and any descendant of THAT boundary calling useI18n() (both fallback
// components below do) throws "useI18n must be used within I18nProvider"
// instead of the real underlying error. See Match.tsx in @tanstack/react-router
// for the shellComponent/errorComponent/notFoundComponent structure this relies on.
function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <I18nProvider>
          {children}
          <MigrationAnnouncement />
        </I18nProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

