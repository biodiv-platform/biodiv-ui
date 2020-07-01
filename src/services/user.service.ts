import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";
import notification from "@utils/notification";

export const axGetUsersByID = async (userIds) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USER}/v1/user/bulk/ibp`, {
      params: { userIds }
    });
    return data.map(({ name, id }) => ({ label: name, value: id }));
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
    return data.map(({ name, id }) => ({ label: name, value: id }));
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: [] };
  }
};
