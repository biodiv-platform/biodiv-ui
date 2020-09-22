import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import { nanoid } from "nanoid";

export const axGetLandscapeById = async (landscapeId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.LANDSCAPE}/landscape/${landscapeId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetLandscapeShowById = async (landscapeId, languageId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.LANDSCAPE}/landscape/show/${landscapeId}`, {
      params: { languageId }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axSaveLandscapeField = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.LANDSCAPE}/landscape/field/content`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUploadEditorResource = (blobInfo, success, failure) => {
  const formData = new FormData();
  formData.append("upload", blobInfo.blob(), blobInfo.filename());
  formData.append("hash", nanoid());
  formData.append("directory", "landscape");

  http
    .post(`${ENDPOINT.FILES}/upload/resource-upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((r) => {
      success(`${ENDPOINT.FILES}/get/raw/landscape${r.data.uri}`);
    })
    .catch(() => {
      failure("Error");
    });
};

export const axGetLandscapeList = async (params) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.LANDSCAPE}/landscape/all`, {
      params
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axDownloadLandscape = async (protectedAreaId, type) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.LANDSCAPE}/landscape/download`,
      {},
      { params: { protectedAreaId, type }, responseType: "blob" }
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};
