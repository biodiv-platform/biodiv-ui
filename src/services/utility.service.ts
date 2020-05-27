import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";
import { getYouTubeId } from "@utils/media";
import axios from "axios";

export const axGetLangList = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.OBSERVATION}/v1/observation/language`, {
      params: { isDirty: false }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetPortalStats = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.UTILITY}/v1/services/portalStats`);
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
