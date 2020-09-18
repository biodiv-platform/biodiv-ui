import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import notification from "@utils/notification";
import axios from "axios";
import { stringify } from "query-string";

/**
 * Acquires initial tokens against provided credentials
 *
 * @param {username: string, password: string} body
 * @returns {*}
 */
export const axLogin = async (payload) => {
  try {
    const { data } = await axios.post(`${ENDPOINT.USERGROUP}/v1/group/login`, stringify(payload));
    return { success: true, data };
  } catch (e) {
    return { success: false, data: e.response.data };
  }
};

export const axGetUser = async () => {
  try {
    const { data } = await http.get(`${ENDPOINT.USER}/v1/user/me`);
    return { success: true, data };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axCreateUser = async (payload) => {
  try {
    const { data } = await axios.post(`${ENDPOINT.USERGROUP}/v1/group/register`, payload);
    return { success: true, data };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axValidateUser = async (payload) => {
  try {
    const { data } = await axios.post(
      `${ENDPOINT.USERGROUP}/v1/group/verify-user`,
      stringify(payload)
    );
    return { success: true, data };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axRegenerateOTP = async (payload) => {
  try {
    const { data } = await axios.post(
      `${ENDPOINT.USER}/v1/authenticate/regenerate-otp`,
      stringify(payload)
    );
    return { success: true, data };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axForgotPassword = async (payload) => {
  try {
    const { data } = await axios.post(
      `${ENDPOINT.USER}/v1/authenticate/forgot-password`,
      stringify(payload)
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axResetPassword = async (payload) => {
  try {
    const { data } = await axios.post(
      `${ENDPOINT.USER}/v1/authenticate/reset-password`,
      stringify(payload)
    );
    return { success: true, data };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axUserSearch = async (name) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/user/autocomplete`, {
      params: { name }
    });
    return { success: true, data: data.map((o) => ({ ...o, display: o.name })) };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: [] };
  }
};
