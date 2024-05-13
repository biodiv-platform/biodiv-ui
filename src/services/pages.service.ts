import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { formDataHeaders, plainHttp } from "@utils/http";
import { treeToFlat } from "@utils/pages";
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

export const axUploadMediaEditorPageResource = async (callback) => {
  try {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "video/mp4");
    fileInput.onchange = async () => {
      if (!fileInput.files) return;
      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("upload", file);
      formData.append("hash", nanoid());
      formData.append("directory", "pages");

      try {
        const response = await http.post(`${ENDPOINT.FILES}/upload/resource-upload`, formData, {
          headers: formDataHeaders
        });
        const url = `${ENDPOINT.FILES}/get/raw/pages${response.data.uri}`;
        callback(url);
      } catch (error) {
        console.error("Error uploading file:", error);
        callback(null, { text: "Upload failed" });
      }
    };

    fileInput.click();
  } catch (error) {
    console.error("Error selecting file:", error);
    callback(null, { text: "File selection failed" });
  }
};

export const axUploadHomePageEditorResource = async (blobInfo) => {
  return new Promise((success, failure) => {
    const formData = new FormData();
    formData.append("upload", blobInfo.blob(), blobInfo.filename());
    formData.append("hash", nanoid());
    formData.append("directory", "homePage");

    http
      .post(`${ENDPOINT.FILES}/upload/resource-upload`, formData, {
        headers: formDataHeaders
      })
      .then((r) => {
        success(`${ENDPOINT.FILES}/get/raw/homePage${r.data.uri}`);
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

export const axAddPageComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.PAGES}/v1/page/add/comment`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
