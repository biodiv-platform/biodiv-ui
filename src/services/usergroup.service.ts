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

export const axCreateGroup = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USERGROUP}/v1/group/create`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetGroupEditById = async (groupId) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/edit/${groupId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetGroupMembersById = async (groupId) => {
  try {
    const { data } = await http.get(
      `${ENDPOINT.USERGROUP}/v1/group/adminstration/members/${groupId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateUserGroup = async (payload, userGroupId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/edit/save/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axAddAdminMembers = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USERGROUP}/v1/group/add/members`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axRemoveAdminMembers = async (params) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/remove/members`, { params });
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
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
    await http.post(`${ENDPOINT.USERGROUP}/v1/group/validate/members`, { token });
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
    await http.post(`${ENDPOINT.USERGROUP}/v1/group/validate/request`, { token });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
