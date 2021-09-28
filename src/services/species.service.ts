import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { plainHttp } from "@utils/http";

export const axGetSpeciesById = async (speciesId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/show/${speciesId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetAllTraitsMeta = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/traits/all`);
    return { success: true, data: data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetAllTraitsMetaByTaxonId = async (taxonId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.SPECIES}/v1/species/traits/taxonomy/${taxonId}`
    );
    return { success: true, data: data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetAllFieldsMeta = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/fields/render`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axFollowSpecies = async (speciesId, follow = true) => {
  const action = follow ? "follow" : "unfollow";
  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.SPECIES}/v1/species/${action}/${speciesId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axSaveUserGroups = async (speciesId, userGroupList) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/observation/update/usergroup/${speciesId}`,
      userGroupList
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axUpdateSpeciesTrait = async (speciesId, traitId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/update/traits/${speciesId}/${traitId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axUpdateSpeciesField = async (speciesId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/update/speciesField/${speciesId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axRemoveSpeciesField = async (speciesFieldId) => {
  try {
    await http.delete(`${ENDPOINT.SPECIES}/v1/species/remove/speciesField/${speciesFieldId}`);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

export const axUpdateSpeciesCommonName = async (speciesId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/update/commonname/${speciesId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axDeleteSpeciesCommonName = async (speciesId, commonNameId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.SPECIES}/v1/species/remove/commonname/${speciesId}/${commonNameId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axPreferredSpeciesCommonName = async (commonNameId) => {
  try {
    const { data } = await http.put(`${ENDPOINT.TAXONOMY}/v1/cname/preffered`, null, {
      params: { commonNameId }
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axUpdateSpeciesSynonym = async (speciesId, _taxonId, payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.SPECIES}/v1/species/update/synonyms/${speciesId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axDeleteSpeciesSynonym = async (speciesId, _taxonId, commonNameId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.SPECIES}/v1/species/remove/synonyms/${speciesId}/${commonNameId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axSpeciesPullResourcesList = async (speciesId, offset) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.SPECIES}/v1/species/pull/observation/resource/${speciesId}`,
      {
        params: { offset }
      }
    );
    return { success: true, data: data || [] };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUpdateSpeciesGalleryResources = async (speciesId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/update/resource/${speciesId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axCheckSpecies = async (taxonId) => {
  try {
    const { data } = await http.get(`${ENDPOINT.SPECIES}/v1/species/check/species`, {
      params: { taxonId }
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

export const axCreateSpecies = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.SPECIES}/v1/species/add`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

export const axCheckSpeciesPermission = async (ctx, speciesId) => {
  try {
    const { data } = await http.get(`${ENDPOINT.SPECIES}/v1/species/permission/${speciesId}`, {
      params: { ctx, skipRefresh: true }
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axDeleteSpecies = async (speciesId) => {
  try {
    const { data } = await http.delete(`${ENDPOINT.SPECIES}/v1/species/remove/${speciesId}`);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axGetSpeciesList = async (params) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/list`, { params });
    return { success: true, ...data };
  } catch (e) {
    console.error(e);
    return { success: false, totalCount: 0, speciesTiles: [] };
  }
};
