import { ENDPOINT } from "@static/constants";
import axios from "axios";

import { getParsedUser, isTokenExpired, setCookies } from "./auth";
import notification from "./notification";

export const formDataHeaders: any = { "Content-Type": "multipart/form-data" };

const defaultHeaders: any = {
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
  setCookies(res.data);
  return res.data.accessToken;
};

/**
 * Returns `access_token`
 *
 * @returns {string}
 */
export const getBearerToken = async (ctx?) => {
  try {
    const user = getParsedUser(ctx);
    const isExpired = isTokenExpired(user.exp);
    const finalToken = isExpired ? await axRenewToken(user.refreshToken) : user.accessToken;
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
      options.headers = { ...(options.headers || {}), Authorization: token };
    } else {
      if (!options?.params?.skipRefresh) {
        throw -1;
      }
    }

    if (options?.params?.ctx) {
      delete options.params.ctx;
      delete options.params.skipRefresh;
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
