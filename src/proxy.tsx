import SITE_CONFIG from "@configs/site-config";
import { NextRequest, NextResponse } from "next/server";

/**
 * Security headers, most importantly a Content-Security-Policy (CSP).
 *
 * The CSP is the platform-wide backstop for every script-injection /
 * reflected- or stored-XSS style issue: even where a page fails to
 * sanitize something correctly, the browser will still refuse to execute
 * any script that isn't either same-origin, from an explicitly trusted
 * host, or tagged with the per-request nonce generated below. It cannot
 * fix an injection bug on its own, but it meaningfully limits what an
 * attacker can do with one (e.g. reading/exfiltrating cookies, redirecting
 * the page, keylogging) and is defense-in-depth alongside proper output
 * encoding elsewhere in the app.
 *
 * A per-request nonce is used (rather than 'unsafe-inline') for scripts so
 * that the handful of legitimate inline/injected scripts this app uses
 * (Next.js's own bootstrap scripts, the GTM loader in
 * `components/@core/container/metadata.tsx`) keep working, while an
 * attacker-injected <script> tag - which cannot know the nonce - does not
 * execute. `strict-dynamic` lets those trusted, nonced scripts load
 * further scripts (as GTM does) without needing to allowlist every
 * possible third-party host it might call out to.
 */

const additionalConnectOrigins = (): string[] => {
  const origins = new Set<string>();

  const candidates = [
    SITE_CONFIG?.SITE?.API_ENDPOINT,
    SITE_CONFIG?.SITE?.API_ENDPOINT_SSR,
    SITE_CONFIG?.SITE?.SSR_URL
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "string") continue;
    // Relative paths (e.g. "/proxy/") are same-origin and already covered by 'self'.
    if (candidate.startsWith("/")) continue;
    try {
      origins.add(new URL(candidate).origin);
    } catch {
      // not an absolute URL - ignore
    }
  }

  return Array.from(origins);
};

const buildCsp = (nonce: string): string => {
  const connectExtra = additionalConnectOrigins().join(" ");

  const directives: Record<string, string> = {
    "default-src": "'self'",
    // 'unsafe-inline' is listed for legacy browsers only: any browser that
    // understands nonce-/hash-sources (all current browsers) ignores
    // 'unsafe-inline' automatically once a nonce is present (CSP Level 2+),
    // so it provides graceful degradation without weakening the policy
    // anywhere it actually matters. This mirrors Google's documented
    // "strict CSP" pattern: https://web.dev/articles/strict-csp
    "script-src": `'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
    "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src": "'self' data: blob: https:",
    "font-src": "'self' data: https://fonts.gstatic.com",
    "connect-src": `'self' https: ${connectExtra}`.trim(),
    "frame-src": "'self' https://www.googletagmanager.com https://accounts.google.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com",
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "frame-ancestors": "'self'",
    "upgrade-insecure-requests": ""
  };

  return Object.entries(directives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join("; ");
};

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  // Only the nonce needs to reach the page/render layer (see
  // src/pages/_document.tsx); the CSP itself only matters as a response
  // header, set below.
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders }
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - Next.js internal static assets and image optimizer
     * - files with an extension (static assets in /public)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};