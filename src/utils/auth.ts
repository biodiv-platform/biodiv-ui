import SITE_CONFIG from "@configs/site-config.json";
import { Role } from "@interfaces/custom";
import { TOKEN } from "@static/constants";
import { AUTHWALL } from "@static/events";
import B64URL from "base64-url";
import JWTDecode from "jwt-decode";
import { destroyCookie, parseCookies, setCookie } from "nookies";
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

// sets/re-sets cookies on development mode
export const setCookies = (tokens, ctx?) => {
  const cookieOpts = {
    maxAge: 60 * 60 * 24 * 7, // 1 Week
    path: "/",
    domain: getDomain()
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

export const forwardRedirect = (forward?) => {
  window.location.assign(B64URL.decode(forward || "Lw"));
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

export const hasAccess = (allowedRoles: Role[], ctx?) => {
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
