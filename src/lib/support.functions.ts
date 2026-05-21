import { createServerFn } from "@tanstack/react-start";

type Level = "blues-friend" | "blues-supporter" | "blues-patron";

const TIERS: Record<Level, { amount: number; name: string }> = {
  "blues-friend": { amount: 5000, name: "Blues Friend" },
  "blues-supporter": { amount: 15000, name: "Blues Supporter" },
  "blues-patron": { amount: 50000, name: "Blues Patron" },
};

export const createSupportCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: { level: Level; origin: string }) => {
    if (!TIERS[input.level]) throw new Error("Invalid level");
    if (!input.origin || typeof input.origin !== "string") throw new Error("Missing origin");
    return input;
  })
  .handler(async ({ data }) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");

    const tier = TIERS[data.level];

    const body = new URLSearchParams();
    body.append("mode", "payment");
    body.append("success_url", `${data.origin}/support?status=success`);
    body.append("cancel_url", `${data.origin}/support?status=cancelled`);
    body.append("line_items[0][quantity]", "1");
    body.append("line_items[0][price_data][currency]", "nok");
    body.append("line_items[0][price_data][unit_amount]", String(tier.amount));
    body.append("line_items[0][price_data][product_data][name]", `SlowBlues — ${tier.name}`);
    body.append("submit_type", "donate");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const json = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok || !json.url) {
      throw new Error(json.error?.message || `Stripe error ${res.status}`);
    }
    return { url: json.url };
  });
