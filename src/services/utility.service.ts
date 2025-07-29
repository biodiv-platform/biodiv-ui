import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";
import { getYouTubeId } from "@utils/media";
import axios from "axios";

export const axGetLangList = async (document = false) => {
  try {
    const endpoint = document
      ? `${ENDPOINT.DOCUMENT}/v1/services/language`
      : `${ENDPOINT.OBSERVATION}/v1/observation/language`;

    const { data } = await plainHttp.get(endpoint, {
      params: { isDirty: false }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetHomeInfo = async (userGroupId?) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.UTILITY}/v1/services/homePage`, {
      params: { userGroupId }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};

export const axGetAdminHomeInfo = async (ctx) => {
  try {
    const { data } = await http.get(`${ENDPOINT.UTILITY}/v1/services/homePage`, {
      params: { ctx, adminList: true }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};

export const axGetYouTubeInfo = async (url) => {
  try {
    const ytID = getYouTubeId(url);
    const { data } = await axios.get(`${ENDPOINT.UTILITY}/v1/services/youtube/${ytID}`);
    return {
      success: true,
      title: data
    };
  } catch (e) {
    return { success: false };
  }
};

export const axGetAllHabitat = async () => {
  try {
    const { data } = await axios.get(`${ENDPOINT.UTILITY}/v1/services/habitat/all`);
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
};

export const axEditHomePageGallery = async (galleryId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.UTILITY}/v1/services/homePage/edit/${galleryId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axMiniEditHomePageGallery = async (galleryId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.UTILITY}/v1/services/homePage/edit/miniSlider/${galleryId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axCreateMiniGallery = async (payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.UTILITY}/v1/services/homePage/miniGallery/create`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};


export const axEditMiniGallery = async (galleryId,payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.UTILITY}/v1/services/homePage/miniGallery/edit/${galleryId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};

export const axRemoveMiniGallery = async(galleryId) => {
  try {
    await http.delete(
      `${ENDPOINT.UTILITY}/v1/services/homePage/miniGallery/remove/${galleryId}`
    );
    return {success: true, data: null}
  } catch (e) {
    console.error(e)
    return {success: false, data: null}
  }
}

export const axRemoveHomePageGallery = async (galleryId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.UTILITY}/v1/services/homePage/remove/${galleryId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axRemoveMiniHomePageGallery = async (galleryId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.UTILITY}/v1/services/homePage/remove/miniSlider/${galleryId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axInsertHomePageGallery = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.UTILITY}/v1/services/homePage/insert`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axReorderHomePageGallery = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.UTILITY}/v1/services/homePage/reorder`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axReorderMiniHomePageGallery = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.UTILITY}/v1/services/homePage/miniSlider/reorder`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetLanguagesWithSpeciesFields = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.UTILITY}/v1/languages/fieldHeader`);
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
};
