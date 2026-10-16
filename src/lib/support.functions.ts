import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Creates a Stripe Checkout Session for the support box on /support and returns its URL.
// Needs the STRIPE_SECRET_KEY secret (never sent to the browser).

const SUCCESS_URL = "https://www.slow-blues.com/support?success=true";
const CANCEL_URL = "https://www.slow-blues.com/support";

// Fixed amounts use the existing Stripe products; any other amount uses an ad-hoc product.
const PRODUCTS: Record<number, string> = {
  5: "prod_VS7d5qgrgaiWZv",
  10: "prod_VS7gOlWGkFDOmw",
  20: "prod_VS7i2NFB4X0djQ",
};

const STRIPE_LOCALE = { no: "nb", en: "en", sv: "sv", de: "de", pl: "pl" } as const;

const Input = z.object({
  amount: z.number().min(1).max(1000),
  monthly: z.boolean(),
  name: z.string().trim().max(60).optional(),
  message: z.string().trim().max(300).optional(),
  lang: z.enum(["no", "en", "sv", "de", "pl"]).optional(),
});

export const createSupportCheckout = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }): Promise<{ url: string }> => {
    const key = process.env["STRIPE_SECRET_KEY"];
    if (!key) {
      console.error("support checkout: STRIPE_SECRET_KEY is not set");
      throw new Error("Betaling er ikke satt opp ennå");
    }

    const cents = Math.round(data.amount * 100);
    const productId = Number.isInteger(data.amount) ? PRODUCTS[data.amount] : undefined;

    const p = new URLSearchParams();
    p.set("mode", data.monthly ? "subscription" : "payment");
    p.set("success_url", SUCCESS_URL);
    p.set("cancel_url", CANCEL_URL);
    if (data.lang) p.set("locale", STRIPE_LOCALE[data.lang]);
    p.set("line_items[0][quantity]", "1");
    p.set("line_items[0][price_data][currency]", "eur");
    p.set("line_items[0][price_data][unit_amount]", String(cents));
    if (productId) p.set("line_items[0][price_data][product]", productId);
    else p.set("line_items[0][price_data][product_data][name]", data.monthly ? "Support SlowBlues (monthly)" : "Support SlowBlues");
    if (data.monthly) p.set("line_items[0][price_data][recurring][interval]", "month");
    p.set("metadata[source]", "slowblues-support");
    if (data.name) p.set("metadata[name]", data.name);
    if (data.message) p.set("metadata[message]", data.message);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" },
      body: p,
    });
    if (!res.ok) {
      console.error("support checkout: Stripe error", res.status, (await res.text()).slice(0, 300));
      throw new Error("Kunne ikke starte betalingen");
    }
    const session = (await res.json()) as { url?: string };
    if (!session.url) throw new Error("Kunne ikke starte betalingen");
    return { url: session.url };
  });
