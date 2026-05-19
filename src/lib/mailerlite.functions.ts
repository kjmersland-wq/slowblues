import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  listSentCampaigns,
  getCampaign,
  subscribeEmail,
  type MlCampaign,
} from "./mailerlite.server";

export type NewsletterListItem = {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  sentAt: string | null;
};

export type NewsletterDetail = NewsletterListItem & {
  html: string;
  plain: string;
  fromName?: string;
};

function toListItem(c: MlCampaign): NewsletterListItem {
  const email = c.emails?.[0];
  return {
    id: c.id,
    name: c.name,
    subject: email?.subject ?? c.subject ?? c.name,
    previewText: email?.preview_text ?? c.preview_text ?? "",
    sentAt: c.finished_at ?? c.scheduled_for ?? c.created_at ?? null,
  };
}

export const fetchNewsletterArchive = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: NewsletterListItem[] }> => {
    const campaigns = await listSentCampaigns(40);
    return { items: campaigns.map(toListItem) };
  },
);

export const fetchNewsletter = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data }): Promise<{ item: NewsletterDetail | null }> => {
    const c = await getCampaign(data.id);
    if (!c) return { item: null };
    const email = c.emails?.[0];
    return {
      item: {
        ...toListItem(c),
        html: email?.content ?? "",
        plain: email?.plain ?? "",
        fromName: email?.from_name,
      },
    };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; name?: string }) =>
    z
      .object({
        email: z.string().email().max(255),
        name: z.string().min(1).max(100).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const fields = data.name ? { name: data.name } : undefined;
    const result = await subscribeEmail(data.email, fields);
    return result;
  });
