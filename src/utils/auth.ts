import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { TOKEN } from "@static/constants";
import { AUTHWALL } from "@static/events";
import B64URL from "base64-url";
import { deleteCookie, getCookies, setCookie } from "cookies-next";
import JWTDecode from "jwt-decode";
import { emit } from "react-gbus";

/**
 * Extracts base domain name from URL (client side only)
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

// Helper to attach Next.js context (req/res) when called in SSR
const getSSRContext = (ctx?: any) => (ctx ? { req: ctx.req, res: ctx.res } : {});

export const setCookies = (tokens: any, ctx?: any) => {
  const cookieOpts = {
    maxAge: 60 * 60 * 24 * 7, // 1 Week
    path: "/",
    domain: getDomain(),
    ...getSSRContext(ctx)
  };

  setCookie(TOKEN.BATOKEN, tokens.access_token, cookieOpts);
  setCookie(TOKEN.BRTOKEN, tokens.refresh_token, cookieOpts);
};

export const removeCookies = (ctx?: any) => {
  const cookieOpts = {
    path: "/",
    domain: getDomain(),
    ...getSSRContext(ctx)
  };

  deleteCookie(TOKEN.BATOKEN, cookieOpts);
  deleteCookie(TOKEN.BRTOKEN, cookieOpts);
};

export const forwardRedirect = async (forward?: string) => {
  await removeCache();
  window.location.assign(B64URL.decode(forward || "Lw"));
};

export const getParsedUser = (ctx?: any) => {
  const cookies = getCookies(getSSRContext(ctx));
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

export const isTokenExpired = (exp: number) => {
  const currentTime = Date.now() / 1000;
  return exp ? exp < currentTime : true;
};

export const hasAccess = (allowedRoles: Role[], ctx?: any): boolean => {
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

export const unregisterSW = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
  }
};

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

export const waitForAuth = (): Promise<Record<string, unknown>> => {
  return new Promise((resolve: any, reject) => {
    const u = getParsedUser();
    u?.id ? resolve() : emit(AUTHWALL.INIT, { resolve, reject });
  });
};

export const adminOrAuthor = (authorId: number | string, ctx?: any) => {
  const u = getParsedUser(ctx);
  return u?.id === authorId || hasAccess([Role.Admin], ctx);
};

export const CACHE_WHITELIST = ["v2", "mapbox-tiles", "workbox"];
const CACHE_MANUAL = "v2-light-cache";

export const preCacheRoutes = async (currentGroup: any) => {
  try {
    const cache = await window.caches.open(CACHE_MANUAL);
    await cache.add(`${currentGroup.webAddress}/observation/create`);
  } catch (e) {
    console.error(e);
  }
};