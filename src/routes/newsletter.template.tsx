import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { renderNewsletterHTML, DEMO_INPUT, type NewsletterTemplateInput, type NewsletterLink } from "@/lib/newsletterTemplate";
import { IMG } from "@/data/images";
import { Copy, Eye, Code2, Plus, Trash2, Check } from "lucide-react";

export const Route = createFileRoute("/newsletter/template")({
  component: TemplatePage,
  head: () => ({
    meta: [
      { title: "Newsletter Template — SlowBlues" },
      { name: "description", content: "Editorial template for the SlowBlues Monday Letter — generates ready-to-paste HTML for MailerLite." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type LinkField = "internalLinks" | "externalLinks";

function TemplatePage() {
  const [input, setInput] = useState<NewsletterTemplateInput>(DEMO_INPUT);
  const [mode, setMode] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => renderNewsletterHTML(input), [input]);

  const update = <K extends keyof NewsletterTemplateInput>(key: K, value: NewsletterTemplateInput[K]) =>
    setInput((p) => ({ ...p, [key]: value }));

  const updateLink = (field: LinkField, i: number, patch: Partial<NewsletterLink>) =>
    setInput((p) => ({
      ...p,
      [field]: p[field].map((l, idx) => (idx === i ? { ...l, ...patch } : l)),
    }));
  const addLink = (field: LinkField) =>
    setInput((p) => ({ ...p, [field]: [...p[field], { label: "", url: "" }] }));
  const removeLink = (field: LinkField, i: number) =>
    setInput((p) => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }));

  const copy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Editorial"
        title="Monday Letter — Template"
        lead="Fill in the fields, preview, then copy the HTML into MailerLite's custom HTML block. Always links — internal to SlowBlues.no and external to the wider blues world."
        img={IMG.microphone}
      />

      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10">
        {/* Editor */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-gold uppercase tracking-wider">Edit</h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Edition" value={input.edition} onChange={(v) => update("edition", v)} />
            <Field label="Date" value={input.date} onChange={(v) => update("date", v)} />
          </div>
          <Field label="Headline" value={input.headline} onChange={(v) => update("headline", v)} />
          <TextArea label="Intro (paragraphs separated by blank line)" value={input.intro} onChange={(v) => update("intro", v)} rows={5} />

          <div className="border border-gold/20 rounded-lg p-4 bg-card/50">
            <p className="text-xs uppercase tracking-wider text-gold mb-3">Featured YouTube video</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Video ID" value={input.featuredVideo?.videoId ?? ""} onChange={(v) => update("featuredVideo", { ...(input.featuredVideo ?? { title: "" }), videoId: v })} />
              <Field label="Title" value={input.featuredVideo?.title ?? ""} onChange={(v) => update("featuredVideo", { ...(input.featuredVideo ?? { videoId: "" }), title: v })} />
              <Field label="Channel" value={input.featuredVideo?.channel ?? ""} onChange={(v) => update("featuredVideo", { ...(input.featuredVideo ?? { videoId: "", title: "" }), channel: v })} />
            </div>
          </div>

          <Field label="Story title" value={input.storyTitle ?? ""} onChange={(v) => update("storyTitle", v)} />
          <TextArea label="Story body (HTML allowed)" value={input.storyBody ?? ""} onChange={(v) => update("storyBody", v)} rows={5} />

          <LinkEditor
            title="Internal links (SlowBlues.no)"
            links={input.internalLinks}
            onChange={(i, p) => updateLink("internalLinks", i, p)}
            onAdd={() => addLink("internalLinks")}
            onRemove={(i) => removeLink("internalLinks", i)}
          />
          <LinkEditor
            title="External links (YouTube, festivals, artist sites)"
            links={input.externalLinks}
            onChange={(i, p) => updateLink("externalLinks", i, p)}
            onAdd={() => addLink("externalLinks")}
            onRemove={(i) => removeLink("externalLinks", i)}
          />

          <TextArea label="Closing note" value={input.closing ?? ""} onChange={(v) => update("closing", v)} rows={3} />
        </div>

        {/* Output */}
        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("preview")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${mode === "preview" ? "bg-gold text-black border-gold" : "border-gold/30 text-muted-foreground hover:text-foreground"}`}
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button
                onClick={() => setMode("html")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${mode === "html" ? "bg-gold text-black border-gold" : "border-gold/30 text-muted-foreground hover:text-foreground"}`}
              >
                <Code2 className="h-4 w-4" /> HTML
              </button>
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy HTML"}
            </button>
          </div>

          {mode === "preview" ? (
            <iframe
              title="Preview"
              srcDoc={html}
              className="w-full h-[80vh] rounded-lg border border-gold/20 bg-black"
            />
          ) : (
            <pre className="w-full h-[80vh] overflow-auto rounded-lg border border-gold/20 bg-black/60 p-4 text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all">
              {html}
            </pre>
          )}

          <p className="text-xs text-muted-foreground">
            Paste this into MailerLite: <em>Create campaign → Custom HTML editor → paste</em>.
            The <code className="text-gold">{`{$unsubscribe}`}</code> and <code className="text-gold">{`{$forward}`}</code> tokens are replaced by MailerLite automatically.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-card border border-gold/20 rounded-md text-foreground focus:outline-none focus:border-gold text-sm"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 bg-card border border-gold/20 rounded-md text-foreground focus:outline-none focus:border-gold text-sm font-mono leading-relaxed"
      />
    </label>
  );
}

function LinkEditor({
  title,
  links,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  links: NewsletterLink[];
  onChange: (i: number, p: Partial<NewsletterLink>) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="border border-gold/20 rounded-lg p-4 bg-card/50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider text-gold">{title}</p>
        <button onClick={onAdd} className="flex items-center gap-1 text-xs text-gold hover:text-gold/80">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {links.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1.2fr_auto] gap-2 items-center">
            <input
              value={l.label}
              onChange={(e) => onChange(i, { label: e.target.value })}
              placeholder="Label"
              className="px-2 py-1.5 bg-background border border-gold/20 rounded text-sm focus:outline-none focus:border-gold"
            />
            <input
              value={l.url}
              onChange={(e) => onChange(i, { url: e.target.value })}
              placeholder="https://…"
              className="px-2 py-1.5 bg-background border border-gold/20 rounded text-sm focus:outline-none focus:border-gold"
            />
            <input
              value={l.note ?? ""}
              onChange={(e) => onChange(i, { note: e.target.value })}
              placeholder="Optional note"
              className="px-2 py-1.5 bg-background border border-gold/20 rounded text-sm focus:outline-none focus:border-gold"
            />
            <button onClick={() => onRemove(i)} className="text-muted-foreground hover:text-red-400 p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
