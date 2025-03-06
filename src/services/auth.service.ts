import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";
import notification from "@utils/notification";
import { stringify } from "@utils/query-string";
import axios from "axios";

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

export const axCreateUser = async (payload) => {
  try {
    const { data } = await axios.post(`${ENDPOINT.USERGROUP}/v1/group/register`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    notification(e?.response?.data?.message);
    return { success: false, data: {} };
  }
};

export const axValidateUser = async (payload) => {
  try {
    const { data } = await axios.post(
      `${ENDPOINT.USERGROUP}/v1/group/verify-user`,
      stringify(payload)
    );
    return { success: data.status, data, message: `otp.messages.${data.message}` };
  } catch (e) {
    console.error(e);
    return { success: false, data: {}, message: "otp.messages.error" };
  }
};

export const axRegenerateOTP = async (payload) => {
  try {
    const { data } = await axios.post(
      `${ENDPOINT.USER}/v1/authenticate/regenerate-otp`,
      stringify(payload)
    );
    return { success: data.status, data: `otp.messages.${data.message}` };
  } catch (e) {
    console.error(e);
    return { success: false, data: "otp.messages.could_not_send_mail_sms" };
  }
};

export const axForgotPassword = async (payload) => {
  try {
    const { data } = await axios.post(
      `${ENDPOINT.USER}/v1/authenticate/forgot-password`,
      stringify(payload)
    );
    return { success: data.status, data: `otp.messages.${data.message}`, user: data.user || {} };
  } catch (e) {
    console.error(e);
    return { success: false, data: "otp.messages.could_not_send_mail_sms", user: {} };
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
    console.error(e);
    notification(e?.response?.data?.message);
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
    console.error(e);
    notification(e?.response?.data?.message);
    return { success: false, data: [] };
  }
};

export const axSpeciesContributorUserSearch = async (name) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/user/speciesContributor/autocomplete`, {
      params: { name }
    });
    return { success: true, data: data.map((o) => ({ ...o, display: o.name })) };
  } catch (e) {
    console.error(e);
    notification(e?.response?.data?.message);
    return { success: false, data: [] };
  }
};

export const axEsUserAutoComplete = async (name, userGroupId?) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/user/ibp/autocomplete`, {
      params: { name, userGroupId }
    });
    return { success: true, data: data.map((o) => ({ ...o, display: o.name })) };
  } catch (e) {
    console.error(e);
    notification(e?.response?.data?.message);
    return { success: false, data: [] };
  }
};
