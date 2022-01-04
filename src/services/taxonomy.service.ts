import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
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

export const axGetTaxonListData = async (params) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TAXONOMY}/v1/taxonomy/namelist`, { params });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetSpeciesGroupList = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TAXONOMY}/v1/species/all`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axGetTaxonDetails = async (taxonId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TAXONOMY}/v1/taxonomy/show/${taxonId}`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetTaxonTree = async (taxonId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TAXONOMY}/v1/tree/breadcrumb/${taxonId}`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axUpdateTaxonName = async (params) => {
  try {
    const { data } = await http.put(`${ENDPOINT.TAXONOMY}/v1/taxonomy/name`, undefined, { params });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateTaxonStatus = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.TAXONOMY}/v1/taxonomy/status`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axCheckTaxonomy = async (params) => {
  try {
    const { data } = await http.get(`${ENDPOINT.TAXONOMY}/v1/taxonomy/nameSearch`, { params });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: { matched: [], parentMatched: [] } };
  }
};

export const axSaveTaxonomy = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.TAXONOMY}/v1/taxonomy`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

export const axUpdateTaxonPosition = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.TAXONOMY}/v1/taxonomy/position`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateTaxonCommonName = async (_, payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.TAXONOMY}/v1/cname/update/commoName`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axDeleteTaxonCommonName = async (_, commonNameId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.TAXONOMY}/v1/cname/remove/commoName/${commonNameId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axUpdateTaxonSynonym = async (_speciesId, taxonId, payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.TAXONOMY}/v1/taxonomy/update/synonym/${taxonId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axDeleteTaxonSynonym = async (_speciesId, taxonId, commonNameId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.TAXONOMY}/v1/taxonomy/remove/synonym/${taxonId}/${commonNameId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axAddTaxonomyComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(
      `${ENDPOINT.TAXONOMY}/v1/service/add/comment/${payload.rootHolderType}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
