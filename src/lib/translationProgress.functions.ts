import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const LANGS = ["no", "en", "sv", "de", "pl"] as const;
const KEY_FIELDS = ["biography", "short", "influence"] as const;

export const getTranslationProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const isAdmin =
      (context as any)?.claims?.user_role === "admin" ||
      (context as any)?.claims?.app_metadata?.roles?.includes?.("admin");
    // Fall back: rely on RLS — admin client bypasses, so we instead check via user_roles table
    if (!isAdmin) {
      const { data: roles } = await context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId);
      if (!roles?.some((r: any) => r.role === "admin")) {
        throw new Error("Forbidden");
      }
    }

    const cols = ["slug", ...LANGS.flatMap((l) => KEY_FIELDS.map((f) => `${f}_${l}`))].join(",");
    const { data, error } = await supabaseAdmin.from("artists").select(cols);
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as any[];
    const total = rows.length;

    const perLang: Record<string, { complete: number; partial: number; missing: number }> = {};
    for (const lang of LANGS) {
      let complete = 0, partial = 0, missing = 0;
      for (const r of rows) {
        const filled = KEY_FIELDS.filter((f) => {
          const v = r[`${f}_${lang}`];
          return typeof v === "string" && v.trim().length > 0;
        }).length;
        if (filled === KEY_FIELDS.length) complete++;
        else if (filled > 0) partial++;
        else missing++;
      }
      perLang[lang] = { complete, partial, missing };
    }

    const fullyDone = rows.filter((r) =>
      LANGS.every((l) => KEY_FIELDS.every((f) => typeof r[`${f}_${l}`] === "string" && r[`${f}_${l}`].trim().length > 0)),
    ).length;

    return {
      total,
      fullyDone,
      perLang,
      timestamp: Date.now(),
    };
  });
