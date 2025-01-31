import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { formDataHeaders, plainHttp } from "@utils/http";

export const axGetDocumentById = async (documentId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.DOCUMENT}/v1/services/show/${documentId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetEditDocumentById = async (ctx, documentId) => {
  try {
    const { data } = await http.get(`${ENDPOINT.DOCUMENT}/v1/services/edit/${documentId}`, {
      params: { ctx }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axFollowDocument = async (documentId, follow = true) => {
  const action = follow ? "follow" : "unfollow";

  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.DOCUMENT}/v1/services/${action}/${documentId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axFlagDocument = async (documentId, payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(
      `${ENDPOINT.DOCUMENT}/v1/services/flag/${documentId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUnFlagDocument = async (documentId, flagId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.DOCUMENT}/v1/services/unflag/${documentId}/${flagId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axDeleteDocument = async (documentId) => {
  try {
    const { data } = await http.delete(`${ENDPOINT.DOCUMENT}/v1/services/delete/${documentId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axQueryDocumentTagsByText = async (query) => {
  try {
    const { data } = await http.get(`${ENDPOINT.DOCUMENT}/v1/services/tags/autocomplete`, {
      params: { phrase: query }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUpdateDocumentTags = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.put(`${ENDPOINT.DOCUMENT}/v1/services/update/tags`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axDocumentSaveUserGroups = async (documentId, userGroupList) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.DOCUMENT}/v1/services/update/usergroup/${documentId}`,
      userGroupList
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axDocumentGroupsFeature = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.DOCUMENT}/v1/services/featured`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axDocumentGroupsUnFeature = async (documentId, userGroupList) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.DOCUMENT}/v1/services/unfeatured/${documentId}`,
      userGroupList
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetDocumentPermissions = async (documentId) => {
  try {
    const { data } = await http.get(`${ENDPOINT.DOCUMENT}/v1/services/permission/${documentId}`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetDocumentTypes = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.DOCUMENT}/v1/services/bib/item/all`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetDocumentBibFields = async (itemId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.DOCUMENT}/v1/services/bib/fields/${itemId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axParseBib = async (bibFile: File) => {
  try {
    const formData = new FormData();
    formData.append("file", bibFile, bibFile.name);

    const { data } = await plainHttp.post(`${ENDPOINT.DOCUMENT}/v1/services/upload/bib`, formData, {
      headers: formDataHeaders
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axCreateDocument = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.DOCUMENT}/v1/services/create`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateDocument = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.DOCUMENT}/v1/services/update`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axDownloadDocument = async (documentPath, documentId, notes) => {
  try {
    // Fetch document file
    const { data } = await http.get(documentPath, { responseType: "blob" });

    // Log downloded document
    await http.post(`${ENDPOINT.DOCUMENT}/v1/services/log/download`, {
      filePath: documentPath,
      filterUrl: `/document/show/${documentId}`,
      status: "success",
      fileType: "pdf",
      notes
    });

    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

export const axGetListData = async (params, payload = {}, index = "document", type = "_doc") => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.DOCUMENT}/v1/services/list/${index}/${type}`,
      payload,
      { params }
    );

    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateCoverageGroup = async (coverageType, documentId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.DOCUMENT}/v1/services/update/${coverageType}/${documentId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetDocumentScientificNames = async (documentId, params) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.DOCUMENT}/v1/services/names/${documentId}`, {
      params
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateScientifcNameToIsDeleted = async (nameId) => {
  try {
    const { data } = await http.put(`${ENDPOINT.DOCUMENT}/v1/services/deletename/${nameId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { succes: false, data: {} };
  }
};
