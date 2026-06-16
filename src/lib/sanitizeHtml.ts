import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize untrusted HTML from third-party APIs (Fourthwall, MailerLite, etc.)
 * before injecting via dangerouslySetInnerHTML. Defence-in-depth against XSS.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, { FORCE_BODY: true });
}
