import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Fourthwall webhook receiver.
// Verifies HMAC-SHA256 signatures using FOURTHWALL_HMAC_SECRET.
// Fourthwall sends the signature in the `x-fourthwall-hmac-sha256` header
// as a base64-encoded digest of the raw request body.
export const Route = createFileRoute("/api/public/fourthwall-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.FOURTHWALL_HMAC_SECRET;
        if (!secret) {
          console.error("[fourthwall-webhook] missing FOURTHWALL_HMAC_SECRET");
          return Response.json(
            { ok: false, error: "server_misconfigured" },
            { status: 500 },
          );
        }

        const signature =
          request.headers.get("x-fourthwall-hmac-sha256") ??
          request.headers.get("x-fourthwall-signature") ??
          request.headers.get("x-signature");

        if (!signature) {
          return Response.json(
            { ok: false, error: "missing_signature" },
            { status: 401 },
          );
        }

        const rawBody = await request.text();

        const expectedB64 = createHmac("sha256", secret)
          .update(rawBody)
          .digest("base64");
        const expectedHex = createHmac("sha256", secret)
          .update(rawBody)
          .digest("hex");

        const candidate = signature.replace(/^sha256=/i, "").trim();

        const safeEq = (a: string, b: string) => {
          const ab = Buffer.from(a);
          const bb = Buffer.from(b);
          if (ab.length !== bb.length) return false;
          return timingSafeEqual(ab, bb);
        };

        const valid =
          safeEq(candidate, expectedB64) || safeEq(candidate, expectedHex);

        if (!valid) {
          console.warn("[fourthwall-webhook] invalid signature");
          return Response.json(
            { ok: false, error: "invalid_signature" },
            { status: 401 },
          );
        }

        let payload: unknown = null;
        try {
          payload = rawBody ? JSON.parse(rawBody) : null;
        } catch {
          return Response.json(
            { ok: false, error: "invalid_json" },
            { status: 400 },
          );
        }

        const eventType =
          (payload as { type?: string } | null)?.type ?? "unknown";
        console.log(`[fourthwall-webhook] verified event: ${eventType}`);

        // TODO: route event to handler (order.created, order.refunded, etc.)

        return Response.json({ ok: true, event: eventType }, { status: 200 });
      },
    },
  },
});
