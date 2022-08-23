import { ENDPOINT } from "@static/constants";
import http, { formDataHeaders, plainHttp } from "@utils/http";
import { treeToFlat } from "@utils/pages.util";
import { nanoid } from "nanoid";

export const axUploadEditorPageResource = async (blobInfo) => {
  return new Promise((success, failure) => {
    const formData = new FormData();
    formData.append("upload", blobInfo.blob(), blobInfo.filename());
    formData.append("hash", nanoid());
    formData.append("directory", "pages");

    http
      .post(`${ENDPOINT.FILES}/upload/resource-upload`, formData, {
        headers: formDataHeaders
      })
      .then((r) => {
        success(`${ENDPOINT.FILES}/get/raw/pages${r.data.uri}`);
      })
      .catch(() => {
        failure("Error");
      });
  });
};

export const axGetPageByID = async (pageId, format?) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.PAGES}/v1/page/${pageId}`, {
      params: { format }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axDeletePageByID = async (pageId) => {
  try {
    const { data } = await http.delete(`${ENDPOINT.PAGES}/v1/page/${pageId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
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

export const axUpdateTree = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.PAGES}/v1/page/updateTree`, treeToFlat(payload));
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUpdatePage = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.PAGES}/v1/page`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axCreatePage = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.PAGES}/v1/page`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axRemovePageGalleryImage = async (pageId, galleryId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.PAGES}/v1/page/gallery/remove/${pageId}/${galleryId}`
    );

    return { success: true, data };
  } catch (e) {
    console.error(e);

    return { success: false, data: {} };
  }
};
