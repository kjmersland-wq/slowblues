
CREATE TABLE public.newsletter_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  mailerlite_campaign_id TEXT,
  subject TEXT,
  draft_html TEXT,
  source_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_runs TO authenticated;
GRANT ALL ON public.newsletter_runs TO service_role;
ALTER TABLE public.newsletter_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view newsletter runs" ON public.newsletter_runs
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins manage newsletter runs" ON public.newsletter_runs
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER newsletter_runs_touch BEFORE UPDATE ON public.newsletter_runs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_newsletter_runs_scheduled ON public.newsletter_runs (scheduled_for DESC);

CREATE TABLE public.ticker_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text JSONB NOT NULL DEFAULT '{}'::jsonb,
  href TEXT,
  source TEXT NOT NULL DEFAULT 'admin',
  pinned BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ticker_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticker_items TO authenticated;
GRANT ALL ON public.ticker_items TO service_role;
ALTER TABLE public.ticker_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active ticker items" ON public.ticker_items
  FOR SELECT TO anon, authenticated
  USING (expires_at IS NULL OR expires_at > now());
CREATE POLICY "Admins manage ticker items" ON public.ticker_items
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER ticker_items_touch BEFORE UPDATE ON public.ticker_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_ticker_items_active ON public.ticker_items (pinned DESC, created_at DESC);

CREATE TABLE public.news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_url TEXT NOT NULL,
  source_name TEXT,
  image_url TEXT,
  kind TEXT NOT NULL DEFAULT 'news',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_url)
);
GRANT SELECT ON public.news_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_items TO authenticated;
GRANT ALL ON public.news_items TO service_role;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads news items" ON public.news_items
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage news items" ON public.news_items
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER news_items_touch BEFORE UPDATE ON public.news_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_news_items_published ON public.news_items (published_at DESC);
