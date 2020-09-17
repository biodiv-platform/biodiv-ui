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

export const axGetUserGroupById = async (userGroupId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/${userGroupId}`);
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

export const axUserGroupCreate = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USERGROUP}/v1/group/create`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUserGroupUpdate = async (payload, userGroupId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/edit/save/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUserGroupRemoveAdminMembers = async (userGroupId, userId) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/remove/members`, {
      params: { userGroupId, userId }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

/**
 * Will retrive group information for group edit endpoint
 *
 * @param {*} groupId
 * @returns
 */
export const axGetGroupEditInfoByGroupId = async (groupId, ctx) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/edit/${groupId}`, {
      params: { ctx }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetGroupAdministratorsByGroupId = async (groupId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.USERGROUP}/v1/group/adminstration/members/${groupId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axAddGroupAdminMembers = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USERGROUP}/v1/group/add/members`, payload);
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

export const axCheckUserGroupMember = async (userGroupId, userId, ctx) => {
  try {
    if (userGroupId && userId) {
      const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/member/${userGroupId}`, {
        params: { ctx }
      });
      return { success: true, data };
    }
  } catch (e) {
    console.error(e);
  }
  return { success: false, data: userGroupId ? false : true };
};

export const axJoinUserGroup = async (userGroupId) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/join/${userGroupId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

//USERGROUP-CUSTOM-FIELD-API(s)
export const axGetAllCustomFields = async (ctx) => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/customfield/all`, {
      params: { ctx }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: e };
  }
};

export const axGetAllCustomFieldOptionsById = async (observationId, userGroupId, cfId) => {
  try {
    const { data } = await http.get(
      `${ENDPOINT.USERGROUP}/v1/customfield/options/${observationId}/${userGroupId}/${cfId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: e };
  }
};

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

export const axAddExsistingCustomField = async (userGroupId, payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.USERGROUP}/v1/customfield/add/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axReorderCustomField = async (userGroupId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/customfield/reordering/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetUserGroupRules = async (userGroupId, ctx) => {
  try {
    const { data } = await http.get(
      `${ENDPOINT.USERGROUP}/v1/group/filterRule/show/${userGroupId}`,
      { params: { ctx } }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: e };
  }
};

export const axAddUserGroupRule = async (userGroupId, payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.USERGROUP}/v1/group/filterRule/add/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axRemoveUserGroupRule = async (userGroupId, payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.USERGROUP}/v1/group/filterRule/remove/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
