import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { plainHttp } from "@utils/http";

export const axGetDocumentById = async (documentId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.DOCUMENT}/v1/services/show/${documentId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axFollowDocument = async (documentId, follow = true) => {
  // TODO: Not actually created in back-end
  const action = follow ? "follow" : "unfollow";

  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.DOCUMENT}/v1/document/${action}/${documentId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axFlagDocument = async (documentId, payload) => {
  // TODO: Not actually created in back-end
  try {
    await waitForAuth();
    const { data } = await http.post(
      `${ENDPOINT.DOCUMENT}/v1/document/flag/${documentId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axUnFlagDocument = async (documentId, flagId) => {
  // TODO: Not actually created in back-end
  try {
    const { data } = await http.put(
      `${ENDPOINT.DOCUMENT}/v1/document/unflag/${documentId}/${flagId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axDeleteDocument = async (documentId) => {
  // TODO: Not actually created in back-end
  try {
    const { data } = await http.delete(`${ENDPOINT.DOCUMENT}/v1/document/delete/${documentId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axUpdateDocumentTags = async (payload) => {
  // TODO: Not actually created in back-end
  try {
    await waitForAuth();
    const { data } = await http.put(`${ENDPOINT.OBSERVATION}/v1/document/update/tags`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};
