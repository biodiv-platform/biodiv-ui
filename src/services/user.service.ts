import { ENDPOINT } from "@static/constants";
import http from "@utils/http";
import notification from "@utils/notification";

export const axSaveFCMToken = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USER}/v1/user/save-token`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: e.response.data };
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
