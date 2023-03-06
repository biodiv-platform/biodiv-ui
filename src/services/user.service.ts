import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import notification from "@utils/notification";

export const axSaveFCMToken = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USER}/v1/user/save-token`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

export const axSendPushNotification = async (payload) => {
  try {
    await http.post(`${ENDPOINT.USER}/v1/user/send-notification`, payload);
    return { success: true };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetUsersByID = async (userIds) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/user/bulk/ibp`, {
      params: { userIds }
    });
    return data.map(({ name, id, profilePic }) => ({ label: name, value: id, pic: profilePic }));
  } catch (e) {
    notification(e.response.data.message);
    return [];
  }
};

export const axUserFilterSearch = async (name) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/user/autocomplete`, {
      params: { name }
    });
    return data.map((u) => ({ label: u.name, value: u.id }));
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetUserById = async (userId, ctx) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USER}/v1/user/${userId}`, {
      params: { ctx, skipRefresh: true }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateUserAbout = async (payload) => {
  try {
    const { status } = await http.put(`${ENDPOINT.USER}/v1/user/update/details`, payload);
    return { success: status === 200 };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axUpdateNotifications = async (payload) => {
  try {
    const { status } = await http.put(`${ENDPOINT.USER}/v1/user/update/emailPreferences`, payload);
    return { success: status === 200 };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axUpdateUserImage = async (payload) => {
  try {
    const { status } = await http.put(
      `${ENDPOINT.USER}/v1/user/update/image`,
      {},
      { params: payload }
    );
    return { success: status === 200 };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axUpdateUserPassword = async (payload) => {
  try {
    const { status, data } = await http.post(
      `${ENDPOINT.USER}/v1/authenticate/change-password`,
      payload
    );
    return { success: status === 200 && data.status };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axGetUserRoles = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/roles/all`);
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const axUpdateUserPermissions = async (payload) => {
  try {
    const { status } = await http.put(`${ENDPOINT.USER}/v1/user/update/roles`, payload);
    return { success: status === 200 };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axDeleteUser = async (userId) => {
  try {
    const { status } = await http.delete(`${ENDPOINT.USER}/v1/user/delete/${userId}`);
    return { success: status === 200 };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axGetDownloadLogsList = async (params) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/downloadLog/list`, { params });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axDownloadFile = async (documentPath) => {
  try {
    await plainHttp.get(`${ENDPOINT.RAW}/${documentPath}`, {
      responseType: "blob"
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

export const axGetUserList = async (
  params,
  payload = {},
  isAdmin = false,
  index = "extended_user",
  type = "_doc"
) => {
  const httpReq = isAdmin ? http : plainHttp;
  try {
    const { data } = await httpReq.post(`${ENDPOINT.USER}/v1/user/list/${index}/${type}`, payload, {
      params
    });

    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUnsubscribeUser = async (key) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/user/unsubscribe/${key}`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: e?.response?.data };
  }
};
