import { Role } from "@interfaces/custom";
import { ENDPOINT } from "@static/constants";
import { hasAccess } from "@utils/auth";
import http, { plainHttp } from "@utils/http";
import { reorderRemovedGallerySetup, transformUserGroupList } from "@utils/userGroup";

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

export const axGetUserGroupById = async (userGroupId, langId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/${userGroupId}/${langId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGroupListExpanded = async (langId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/list/${langId}`);
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

export const axCreateMiniGroupGallery = async (payload, groupId) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/miniGallery/create/${groupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};

export const axEditMiniGroupGallery = async (groupId,galleryId,payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/miniGallery/edit/${groupId}/${galleryId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};

export const axRemoveMiniGroupGallery = async(groupId,galleryId) => {
  try {
    await http.delete(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/miniGallery/remove/${groupId}/${galleryId}`
    );
    return {success: true, data: null}
  } catch (e) {
    console.error(e)
    return {success: false, data: null}
  }
}

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

export const axGetUserGroupCustomField = async (userGroupId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/customfield/group/${userGroupId}`);
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

export const axUpdateSpeciesFieldsMapping = async (userGroupId, payload) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.USERGROUP}/v1/group/update/speciesFieldsMapping/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetSpeciesFieldsMapping = async (userGroupId) => {
  try {
    const { data: ugSfMappingData } = await plainHttp.get(
      `${ENDPOINT.USERGROUP}/v1/group/userGroupSpeciesFields/${userGroupId}`
    );
    return { success: true, ugSfMappingData };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetUgSpeciesFieldsMetaData = async (userGroupId) => {
  try {
    const { data: ugSfMetaData } = await plainHttp.get(
      `${ENDPOINT.USERGROUP}/v1/group/speciesField/metadata/${userGroupId}`
    );
    return { success: true, ugSfMetaData };
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

export const axGetUserGroupRules = async (userGroupId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.INTEGRATOR}/v1/services/filterRule/show/${userGroupId}`
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
      `${ENDPOINT.INTEGRATOR}/v1/services/filterRule/add/${userGroupId}`,
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
      `${ENDPOINT.INTEGRATOR}/v1/services/filterRule/remove/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetGroupHompageDetails = async (userGroupId, langId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/homePage/${userGroupId}/${langId}`);
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
      `${ENDPOINT.USERGROUP}/v1/group/homePage/remove/${userGroupId}/${Number(galleryList[index].sliderId)}`
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

export const axRemoveMiniGroupHomePageGalleryImage = async (userGroupId, galleryList, index) => {
  try {
    await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/miniSlider/remove/${userGroupId}/${Number(galleryList[index].sliderId)}`
    );
    const { response, payload } = reorderRemovedGallerySetup(galleryList, index);
    if (payload.length > 1) {
      await http.put(`${ENDPOINT.USERGROUP}/v1/group/homePage/miniSlider/reordering/${userGroupId}`, payload);
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

export const axReorderMiniGroupHomePageGallery = async (userGroupId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/miniSlider/reordering/${userGroupId}`,
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

export const axEditMiniGroupHomePageGallery = async (userGroupId, galleryId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/homePage/miniSlider/edit/${userGroupId}/${galleryId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetUserGroupMediaToggle = async (ugId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/mediaToggle/${ugId}`);
    return { success: true, customisations: data };
  } catch (e) {
    console.error(e);
    return { success: false, customisations: {} };
  }
};

export const axUpdateGroupObsCustomisations = async (payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/observationCustomisations/update`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};

export const axUpdateSpeciesFieldContributors = async (userGroupId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.USERGROUP}/v1/group/speciesField/metadata/${userGroupId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axBulkRemoveGroupMembers = async (params, payload = {}) => {
  try {
    const { data } = await http.put(`${ENDPOINT.USERGROUP}/v1/group/remove/bulk/members`, payload, {
      params
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
