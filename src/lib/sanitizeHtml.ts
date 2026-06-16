import DOMPurify from "dompurify";

/**
 * Sanitize untrusted HTML from third-party APIs (Fourthwall, MailerLite, etc.)
 * before injecting via dangerouslySetInnerHTML. Defence-in-depth against XSS.
 * SSR-safe: returns the input unchanged when no DOM is available; the client
 * re-renders and sanitizes on hydration.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  if (typeof window === "undefined") return "";
  return DOMPurify.sanitize(html, { FORCE_BODY: true });
}
