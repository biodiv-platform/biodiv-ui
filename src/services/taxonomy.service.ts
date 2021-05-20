import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";

export const axGetTaxonRanks = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TAXONOMY}/v1/rank/all`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axRequestTaxonPermission = async (payload) => {
  try {
    await http.post(`${ENDPOINT.SPECIES}/v1/species/request`, payload);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

export const axVerifyTaxonPermission = async (token) => {
  try {
    await http.post(`${ENDPOINT.SPECIES}/v1/species/grant`, { token });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
