import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import { preProcessContent } from "@utils/pages.util";

export const axGetPages = async (userGroupId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.PAGES}/v1/newsletter/group`, {
      params: { userGroupId }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetPageByID = async (pageId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.PAGES}/v1/page/${pageId}`);
    return { success: true, data: preProcessContent(data) };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axDeletePageByID = async (pageId) => {
  try {
    const { data } = await http.delete(`${ENDPOINT.PAGES}/v1/page/delete/${pageId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};
