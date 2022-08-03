import { Role } from "@interfaces/custom";
import { DEFAULT_GROUP, ENDPOINT } from "@static/constants";
import { hasAccess } from "@utils/auth";
import { fetchWithCache } from "@utils/cached-fetch";
import http, { plainHttp } from "@utils/http";
import {
  findCurrentUserGroup,
  reorderRemovedGallerySetup,
  transformUserGroupList
} from "@utils/userGroup";

import { axClearMemoryCache } from "./api.service";

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

export const axGroupList = async (url?: string, lang?: string) => {
  try {
    const data = await fetchWithCache(`${ENDPOINT.USERGROUP}/v1/group/all`);
    const groups = transformUserGroupList(data);
    const currentGroup = url ? findCurrentUserGroup(groups, url, lang) : {};
    return { success: true, groups, currentGroup };
  } catch (e) {
    console.error(e);
    return { success: false, groups: [], currentGroup: DEFAULT_GROUP };
  }
};

export const axGroupListExpanded = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/list`);
    return { success: true, data: transformUserGroupList(data) };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axMemberGroupList = async () => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/member/list`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
export const axMemberGroupListByUserId = async (userId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/member/list/${userId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUserGroupCreate = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.USERGROUP}/v1/group/create`, payload);
    await axClearMemoryCache();
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
    await axClearMemoryCache();
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUserGroupDatatableUpdate = async (userGroupId, groupList) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/update/data-table/${userGroupId}`,
      {
        userGroupIds: groupList
      }
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

export const axCheckUserGroupMember = async (userGroupId) => {
  try {
    if (userGroupId) {
      const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/member/${userGroupId}`);
      return data;
    }
  } catch (e) {
    console.error(e);
  }
  return true;
};

export const axCheckUserGroupFounderOrAdmin = async (userGroupId, cleanCheck?) => {
  try {
    if (userGroupId) {
      const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/enable/edit/${userGroupId}`);
      return data;
    }
  } catch (e) {
    console.error(e);
  }
  return cleanCheck ? hasAccess([Role.Admin]) : !userGroupId;
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

export const axLeaveUserGroup = async (userGroupId) => {
  try {
    const { data } = await http.delete(`${ENDPOINT.USERGROUP}/v1/group/leave/${userGroupId}`);
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

export const axGetGroupHompageDetails = async (userGroupId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/homePage/${userGroupId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axUpdateGroupHomePageDetails = async (userGroupId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/update/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axRemoveGroupHomePageGalleryImage = async (userGroupId, galleryList, index) => {
  try {
    await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/remove/${userGroupId}/${galleryList[index]?.id}`
    );
    const { response, payload } = reorderRemovedGallerySetup(galleryList, index);
    if (payload.length > 1) {
      await http.put(`${ENDPOINT.USERGROUP}/v1/group/homePage/reordering/${userGroupId}`, payload);
    }

    return { success: true, data: response };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axReorderGroupHomePageGallery = async (userGroupId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/reordering/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const getAuthorizedUserGroupById = async () => {
  try {
    const { data } = await http.get(`${ENDPOINT.USERGROUP}/v1/group/grouplist/admin`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axcustomFieldEditDetails = async (userGroupId, customFieldId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/customfield/edit/${userGroupId}/${customFieldId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axEditGroupHomePageGallery = async (userGroupId, galleryId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/edit/${userGroupId}/${galleryId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
