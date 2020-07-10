import { ENDPOINT } from "@static/constants";
import http from "@utils/http";

export const axGetUserGroupCustomField = async (userGroupId, ctx) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/customfield/group/${userGroupId}`, {
      params: { ctx }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: e };
  }
};

export const axRemoveCustomField = async (userGroupId, customFieldId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/customfield/remove/${userGroupId}/${customFieldId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axAddCustomField = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USERGROUP}/v1/customfield/create`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
