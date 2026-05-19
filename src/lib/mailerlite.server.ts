// Server-only MailerLite API client (MailerLite v3 — https://connect.mailerlite.com)
// Never import this from client code.

const API_BASE = "https://connect.mailerlite.com/api";

type Cached<T> = { value: T; expires: number };
const cache = new Map<string, Cached<unknown>>();
const TTL_MS = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  cache.delete(key);
  return null;
}
function setCached<T>(key: string, value: T) {
  cache.set(key, { value, expires: Date.now() + TTL_MS });
}

function authHeaders() {
  const token = process.env.MAILERLITE_API_KEY;
  if (!token) throw new Error("MAILERLITE_API_KEY is not configured");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function mlFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MailerLite ${res.status}: ${text.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

export type MlCampaign = {
  id: string;
  name: string;
  subject?: string;
  preview_text?: string;
  status: string;
  emails?: Array<{
    id?: string;
    subject?: string;
    preview_text?: string;
    content?: string;
    plain?: string;
    from?: string;
    from_name?: string;
  }>;
  finished_at?: string | null;
  scheduled_for?: string | null;
  created_at?: string;
};

type CampaignsResponse = { data: MlCampaign[] };
type CampaignResponse = { data: MlCampaign };

export async function listSentCampaigns(limit = 30): Promise<MlCampaign[]> {
  const key = `campaigns:sent:${limit}`;
  const cached = getCached<MlCampaign[]>(key);
  if (cached) return cached;
  try {
    const res = await mlFetch<CampaignsResponse>(
      `/campaigns?filter[status]=sent&limit=${limit}`,
    );
    const data = res.data ?? [];
    setCached(key, data);
    return data;
  } catch (err) {
    console.error("[mailerlite] listSentCampaigns failed:", err);
    return [];
  }
}

export async function getCampaign(id: string): Promise<MlCampaign | null> {
  const key = `campaign:${id}`;
  const cached = getCached<MlCampaign | null>(key);
  if (cached !== null) return cached;
  try {
    const res = await mlFetch<CampaignResponse>(`/campaigns/${id}`);
    setCached(key, res.data ?? null);
    return res.data ?? null;
  } catch (err) {
    console.error("[mailerlite] getCampaign failed:", err);
    return null;
  }
}

export type SubscribeResult =
  | { ok: true; status: "subscribed" | "pending" }
  | { ok: false; error: string };

export async function subscribeEmail(
  email: string,
  fields?: Record<string, string>,
): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${API_BASE}/subscribers`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        email,
        fields: fields ?? {},
        status: "active",
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[mailerlite] subscribe failed:", res.status, text);
      return { ok: false, error: `Subscription failed (${res.status})` };
    }
    return { ok: true, status: "subscribed" };
  } catch (err) {
    console.error("[mailerlite] subscribe error:", err);
    return { ok: false, error: "Subscription service unavailable" };
  }
}
