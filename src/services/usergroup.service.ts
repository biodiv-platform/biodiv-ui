import { UserGroupIbp } from "@interfaces/observation";
import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import { getGroupImage } from "@utils/media";

const defaultGroup = {
  id: 0,
  icon: process.env.NEXT_PUBLIC_SITE_LOGO,
  name: process.env.NEXT_PUBLIC_SITE_TITLE,
  webAddress: process.env.NEXT_PUBLIC_SITE_URL
};

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
    const res = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/group/all`);
    const groups = res.data.map((group: UserGroupIbp) => ({
      ...group,
      webAddress: group.webAddress.startsWith("/")
        ? `${process.env.NEXT_PUBLIC_SITE_URL}${group.webAddress}`
        : group.webAddress,
      icon: getGroupImage(group.icon)
    }));
    const currentGroup =
      groups.find((group: UserGroupIbp) => url.startsWith(group.webAddress)) || defaultGroup;
    return { success: true, groups, currentGroup };
  } catch (e) {
    console.error(e);
    return { success: false, groups: [], currentGroup: defaultGroup };
  }
};

export const axGetPages = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.USERGROUP}/v1/newsletter/group`);
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

export const axGetGroupEditById = async (groupId, ctx) => {
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

export const axUpdateUserGroup = async (payload, observationId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/group/edit/save/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};
