import SITE_CONFIG from "@configs/site-config.json";
import { Role } from "@interfaces/custom";
import { axGetUser } from "@services/auth.service";
import { TOKEN } from "@static/constants";
import { AUTHWALL } from "@static/events";
import { decode } from "base64-url";
import dayjs from "dayjs";
import { getNookie, setNookie } from "next-nookies-persist";
import { emit } from "react-gbus";

interface Session {
  accessToken: string;
  refreshToken: string;
  timeout: string;
  isExpired?: boolean;
}

export const setTokens = (token) => {
  setNookie(TOKEN.AUTH, token);
};

export const getTokens = (ctx = {}): Session => {
  const store = getNookie(TOKEN.AUTH, ctx) || {};
  const accessToken = store[TOKEN.ACCESS];
  const refreshToken = store[TOKEN.REFRESH];
  const timeout = store[TOKEN.TIMEOUT] || 0;
  const isExpired = dayjs(timeout).isBefore(dayjs());
  return {
    accessToken,
    refreshToken,
    timeout,
    isExpired
  };
};

export const hasAccess = (allowedRoles: Role[], ctx?) => {
  const u = getNookie(TOKEN.USER, ctx);

  if (allowedRoles.includes(Role.Any)) {
    return u?.id ? true : false;
  }

  for (const allowedRole of allowedRoles) {
    if (u?.roles?.find((role) => role.authority === allowedRole)) {
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
export const removeCache = async (whitelist = []) => {
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

export const generateSession = async (
  setNookieI,
  tokens,
  redirect = false,
  forward?,
  onSuccess?
) => {
  setNookieI(TOKEN.AUTH, tokens);
  const { success, data } = await axGetUser();
  if (success) {
    setNookieI(TOKEN.USER, data);
    await removeCache();
    if (onSuccess) {
      onSuccess(data);
    }
    if (redirect) {
      window.location.assign(decode(forward || "Lw"));
    }
  }
};

/**
 * 🌈 On the spot authorization wrapped in a one magical promise
 *
 * @returns {Promise<Record<string, unknown>>}
 */
export const waitForAuth = (): Promise<Record<string, unknown>> => {
  return new Promise((resolve: any, reject) => {
    const u = getNookie(TOKEN.USER);
    u?.id ? resolve() : emit(AUTHWALL.INIT, { resolve, reject });
  });
};

export const adminOrAuthor = (authorId, ctx?) => {
  const u = getNookie(TOKEN.USER, ctx);
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
