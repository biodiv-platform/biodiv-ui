import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import notification from "@utils/notification";
import { stringify } from "query-string";

export const axSaveFCMToken = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USER}/v1/user/save-token`, stringify(payload), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: e.response.data };
  }
};

export const axSendPushNotification = async (payload) => {
  try {
    await plainHttp.post(`${ENDPOINT.USER}/v1/user/send-notification`, stringify(payload), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    return { success: true };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: [] };
  }
};
