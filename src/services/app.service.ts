import { DEFAULT_GROUP, ENDPOINT } from "@static/constants";
import { fetchWithCache } from "@utils/cached-fetch";
import http, { plainHttp } from "@utils/http";
import { findCurrentUserGroup, transformUserGroupList } from "@utils/userGroup";

export const axGroupList = async (url?: string, langId?: string,lang?: string) => {
  try {
    const data = await fetchWithCache(`${ENDPOINT.USERGROUP}/v1/group/all/${langId}`);
    const groups = transformUserGroupList(data);
    const currentGroup = url ? findCurrentUserGroup(groups, url, lang) : {};
    return { success: true, groups, currentGroup };
  } catch (e) {
    console.error(e);
    return { success: false, groups: [], currentGroup: DEFAULT_GROUP };
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

export const axGetTree = async (params) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.PAGES}/v1/page/tree`, { params });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
