import { AxiosRequestConfig } from "axios";
import cacheData from "memory-cache";

import { plainHttp } from "./http";

/**
 * axios request proxy instance that caches response in cache for faster retrival
 *
 * @param {string} url
 * @param {AxiosRequestConfig} [config]
 * @return {*}
 */
export const fetchWithCache = async (url: string, config?: AxiosRequestConfig) => {
  const value = cacheData.get(url);
  const ttl = 24 * 1000 * 60 * 60; // 24 hours

  if (value) {
    return value;
  } else {
    const { data } = await plainHttp.get(url, config);
    cacheData.put(url, data, ttl);
    return data;
  }
};

/**
 * clears all cached keys from memory
 */
export const clearFetchWithCache = () => cacheData.clear();
