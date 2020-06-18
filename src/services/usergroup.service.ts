import { DEFAULT_GROUP, ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import { findCurrentUserGroup, transformUserGroupList } from "@utils/userGroup";

export const axGetUserGroupList = async () => {
  try {
    const { data } = await http.get(`${ENDPOINT.OBSERVATION}/v1/observation/usergroup`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGroupList = async (url) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/all`);
    const groups = transformUserGroupList(data);
    const currentGroup = findCurrentUserGroup(groups, url);
    return { success: true, groups, currentGroup };
  } catch (e) {
    console.error(e);
    return { success: false, groups: [], currentGroup: DEFAULT_GROUP };
  }
};

export const axGetPages = async (userGroupId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/newsletter/group`, {
      params: { userGroupId }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

/**
 * when user accepts invitation to be moderator of any userGroup
 *
 * @param {string} token
 * @returns
 */
export const axVerifyInvitation = async (token) => {
  try {
    await http.post(`${ENDPOINT.USERGROUP}/v1/accept-invitation`, { token });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

/**
 * userGroup moderators can accept request made by user to join userGroup
 *
 * @param {string} token
 * @returns
 */
export const axVerifyRequest = async (token) => {
  try {
    await http.post(`${ENDPOINT.USERGROUP}/v1/accept-invitation`, { token });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
