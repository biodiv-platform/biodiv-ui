import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { TOKEN } from "@static/constants";
import { AUTHWALL } from "@static/events";
import B64URL from "base64-url";
import { parseCookie, stringifySetCookie } from "cookie";
import JWTDecode from "jwt-decode";
import { emit } from "react-gbus";

/**
 * This extracts base domain name from URL
 *
 * @warning client side only
 */
const getDomain = () => {
  const domain = /[a-z0-9][a-z0-9\-]*[a-z0-9]\.[a-z\.]{2,6}$/i;
  const parsedUrl = new URL(window.location.origin.toLowerCase());

  if (parsedUrl.hostname !== null) {
    const hostMatched = parsedUrl.hostname.match(domain);
    return hostMatched ? hostMatched[0] : parsedUrl.hostname;
  }

  const pathMatched = parsedUrl.pathname.match(domain);
  return pathMatched ? pathMatched[0] : "";
};

const setCookie = (ctx, name: string, value: string, opts: any) => {
  const serialized = stringifySetCookie({ name, value, ...opts });

  if (ctx?.res) {
    const existing = ctx.res.getHeader("Set-Cookie");
    const existingArr = existing ? (Array.isArray(existing) ? existing : [existing]) : [];
    ctx.res.setHeader("Set-Cookie", [...existingArr, serialized]);
    return;
  }

  if (typeof document !== "undefined") {
    document.cookie = serialized;
  }
};

const destroyCookie = (ctx, name: string, opts: any) => {
  setCookie(ctx, name, "", { ...opts, maxAge: 0 });
};

const parseCookies = (ctx?): Record<string, string> => {
  const header = ctx?.req
    ? ctx.req.headers?.cookie || ""
    : typeof document !== "undefined"
    ? document.cookie || ""
    : "";
  return parseCookie(header) as Record<string, string>;
};

export const getClientCookies = (): Record<string, string> => {
  const header = typeof document !== "undefined" ? document.cookie || "" : "";
  return parseCookie(header) as Record<string, string>;
};

export const setClientCookie = (name: string, value: string, opts: any = {}) => {
  document.cookie = stringifySetCookie({ name, value, ...opts });
};

// sets/re-sets cookies on development mode
export const setCookies = (tokens, ctx?) => {
  const isHttps =
    typeof window !== "undefined"
      ? window.location.protocol === "https:"
      : process.env.NODE_ENV === "production";

  const cookieOpts = {
    maxAge: 60 * 60 * 24 * 7, // 1 Week
    path: "/",
    domain: getDomain(),
    sameSite: "Lax" as const,
    secure: isHttps
  };

  setCookie(ctx, TOKEN.BATOKEN, tokens.access_token, cookieOpts);
  setCookie(ctx, TOKEN.BRTOKEN, tokens.refresh_token, cookieOpts);
};

export const removeCookies = () => {
  const cookieOpts = {
    path: "/",
    domain: getDomain()
  };

  destroyCookie(null, TOKEN.BATOKEN, cookieOpts);
  destroyCookie(null, TOKEN.BRTOKEN, cookieOpts);
};

/**
 * Validates that a post-login redirect target is a same-origin, relative
 * path within the portal, never an absolute URL or protocol-relative URL.
 *
 * This is the control that prevents open-redirect / phishing attacks where
 * an attacker crafts a link like `/login?forward=<base64 of https://evil.com>`
 * (or a `javascript:` URL) to have a victim redirected off-portal, or have
 * script executed, immediately after a successful sign-in.
 *
 * A safe value must:
 *  - start with a single "/" (a root-relative path), and
 *  - NOT start with "//" or "/\" (protocol-relative URLs like //evil.com
 *    are treated by browsers as absolute and navigate off-origin), and
 *  - NOT contain a scheme (e.g. "javascript:", "data:", "https:") anywhere
 *    before the first "/", which would otherwise be interpreted as a URL
 *    rather than a path.
 *
 * @param {string} decoded
 * @returns {boolean}
 */
export const isSafeRedirectPath = (decoded: string): boolean => {
  if (typeof decoded !== "string" || decoded.length === 0) {
    return false;
  }

  // Must be root-relative ("/something"), not scheme-relative ("//host" or "/\host")
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.startsWith("/\\")) {
    return false;
  }

  // Reject anything that resolves to a different origin or a non-http(s)
  // scheme (javascript:, data:, vbscript:, etc.) when parsed by the browser.
  try {
    const resolved = new URL(decoded, window.location.origin);
    return resolved.origin === window.location.origin;
  } catch {
    return false;
  }
};

export const forwardRedirect = async (forward?) => {
  // remove cache
  await removeCache();

  let target = "/";
  try {
    const decoded = B64URL.decode(forward || "Lw");
    if (isSafeRedirectPath(decoded)) {
      target = decoded;
    }
  } catch {
    target = "/";
  }

  // redirect - always same-origin, relative path only
  window.location.assign(target);
};

export const getParsedUser = (ctx?) => {
  const cookies = parseCookies(ctx);
  const accessToken = cookies?.[TOKEN.BATOKEN];
  const refreshToken = cookies?.[TOKEN.BRTOKEN];

  if (accessToken) {
    const decoded: any = JWTDecode(accessToken);
    return {
      ...decoded,
      id: parseInt(decoded.id),
      accessToken,
      refreshToken
    };
  }

  return {};
};

export const isTokenExpired = (exp) => {
  const currentTime = Date.now() / 1000;
  return exp ? exp < currentTime : true;
};

export const hasAccess = (allowedRoles: Role[], ctx?): boolean => {
  const u = getParsedUser(ctx);

  if (allowedRoles.includes(Role.Any)) {
    return u?.id ? true : false;
  }

  for (const allowedRole of allowedRoles) {
    if (u?.roles?.includes(allowedRole)) {
      return true;
    }
  }
  return false;
};

/**
 * Manually unregisters running service worker(s)
 * After this do hard redirect so service worker can reregister itself and precache routes
 */
export const unregisterSW = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
  }
};

/**
 * Delete caches from browser `Cache`
 */
export const removeCache = async (whitelist = [] as string[]) => {
  try {
    if (process.env.NODE_ENV !== "production" || !SITE_CONFIG.OFFLINE.ACTIVE) {
      return;
    }

    await (window as any).workbox.register();
    caches.keys().then(async (keyList) => {
      await Promise.all(
        keyList.map((key) => {
          const cacheIndex = whitelist.findIndex((cache) => key.includes(cache));
          if (cacheIndex === -1) {
            console.debug("cache deleted", key);
            return caches.delete(key);
          } else {
            console.debug("cache skipped", key);
          }
        })
      );
    });

    if (!whitelist.length) {
      await unregisterSW();
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 🌈 On the spot authorization wrapped in a one magical promise
 *
 * @returns {Promise<Record<string, unknown>>}
 */
export const waitForAuth = (): Promise<Record<string, unknown>> => {
  return new Promise((resolve: any, reject) => {
    const u = getParsedUser();
    u?.id ? resolve() : emit(AUTHWALL.INIT, { resolve, reject });
  });
};

export const adminOrAuthor = (authorId, ctx?) => {
  const u = getParsedUser(ctx);
  return u?.id === authorId || hasAccess([Role.Admin], ctx);
};

export const CACHE_WHITELIST = ["v2", "mapbox-tiles", "workbox"];

const CACHE_MANUAL = "v2-light-cache";

export const preCacheRoutes = async (currentGroup) => {
  try {
    const cache = await window.caches.open(CACHE_MANUAL);
    await cache.add(`${currentGroup.webAddress}/observation/create`);
  } catch (e) {
    console.error(e);
  }
};
