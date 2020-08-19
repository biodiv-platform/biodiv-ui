import { ENDPOINT } from "@static/constants";
import axios from "axios";

import { getTokens, setTokens } from "./auth";
import notification from "./notification";

const defaultHeaders = {
  headers: {
    post: { "Content-Type": "application/json" },
    put: { "Content-Type": "application/json" }
  }
};

/**
 * Renews `access_token` if expired
 *
 * @param {string} refreshToken
 * @returns {string}
 */
const axRenewToken = async (refreshToken: string) => {
  const res = await axios.post(`${ENDPOINT.USER}/v1/authenticate/refresh-tokens`, null, {
    params: { refreshToken }
  });
  setTokens(res.data);
  return res.data.accessToken;
};

/**
 * Returns `access_token`
 *
 * @returns {string}
 */
const getBearerToken = async (ctx?) => {
  try {
    const { accessToken, refreshToken, isExpired } = getTokens(ctx);
    const finalToken = !isExpired ? accessToken : await axRenewToken(refreshToken);
    return `Bearer ${finalToken}`;
  } catch (e) {
    return false;
  }
};

const http = axios.create(defaultHeaders);

/*
 * Custom interceptor that allows user to pass custom context (for SSR)
 */
http.interceptors.request.use(
  async (options) => {
    if (options?.headers?.unauthorized || options?.data?.headers?.unauthorized) {
      return options;
    }

    const token = await getBearerToken(options?.params?.ctx);
    if (token) {
      options.headers["Authorization"] = token;
    } else {
      if (!options?.params?.skipRefresh) {
        throw -1;
      }
    }

    if (options?.params?.ctx) {
      delete options.params.ctx;
    }

    return options;
  },
  (error) => {
    notification("Session Expired!");
    return Promise.reject(error);
  }
);

export const plainHttp = axios.create(defaultHeaders);

export default http;
