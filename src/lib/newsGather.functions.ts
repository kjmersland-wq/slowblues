import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin-only: preview the Firecrawl news gather (does not write to DB).
 * Used by the admin ticker/newsletter pages to sanity-check the feed.
 */
export const previewBluesNews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { searchBluesNews } = await import("./newsGather.server");
    try {
      const items = await searchBluesNews({ limit: 15, days: 7 });
      return { ok: true as const, items };
    } catch (e: any) {
      return { ok: false as const, error: String(e?.message ?? e) };
    }
  });
