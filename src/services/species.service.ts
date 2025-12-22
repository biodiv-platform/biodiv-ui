import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { plainHttp } from "@utils/http";
import notification from "@utils/notification";
import { createSpeciesFieldPayload } from "@utils/species";

export const axGetSpeciesById = async (speciesId, payload) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.SPECIES}/v1/species/show/${speciesId}`,
      payload
    );

    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetAllTraitsMeta = async (langId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/traits/all/${langId}`);
    return { success: true, data: data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetAllTraitsMetaByTaxonId = async (taxonId, langId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.SPECIES}/v1/species/traits/taxonomy/${taxonId}/${langId}`
    );
    return { success: true, data: data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetAllFieldsMeta = async (params) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/fields/render`, {
      params
    });
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
      `${ENDPOINT.SPECIES}/v1/species/update/usergroup/${speciesId}`,
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

export const axPreferredSpeciesCommonName = async (speciesId, commonNameId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/update/preferred-commonname/${speciesId}/${commonNameId}`
    );
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

export const axGetSpeciesList = async (params, actions = false) => {
  const fetchHttp = actions ? http : plainHttp;
  try {
    const { data } = await fetchHttp.get(
      `${ENDPOINT.SPECIES}/v1/species/list/extended_species/_doc`,
      { params }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, totalCount: 0, speciesTiles: [] };
  }
};

export const axGetSpeciesIdFromTaxonId = async (taxonId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/speciesid/${taxonId}`);
    return { success: true, data: data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axCreateSpeciesReferences = async (payload, speciesId) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.SPECIES}/v1/species/add/reference/${speciesId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

export const axUpdateSpeciesReferences = async (payload, speciesId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/update/reference/${speciesId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

export const axDeleteSpeciesReferences = async (referenceId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/delete/reference/${referenceId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: null };
  }
};

// export const axCreateSpeciesField = async (payload) => {
//   try {
//     const { data } = await http.post(
//       `${ENDPOINT.SPECIES}/v1/species/create/field`,
//       payload
//     );
//     return { success: true, data };
//   } catch (e) {
//     return { success: false, data: null };
//   }
// };

export const axCreateSpeciesField = async (input, parentId: number, displayOrder = 1) => {
  try {
    const payload = createSpeciesFieldPayload(input, parentId, displayOrder);
    const { data } = await http.post(`${ENDPOINT.SPECIES}/v1/species/create/field`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    notification(e?.response?.data?.message);
    return { success: false, data: {} };
  }
};

export const axUpdateSpeciesFieldTranslations = async (
  fieldTranslations: Array<{
    fieldId: number;
    translations: Array<{
      langId: number;
      header: string;
      description: string;
      urlIdentifier: string;
    }>;
  }>
) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/field/translations`,
      fieldTranslations
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: null };
  }
};

/**
 * Fetches all translations for a species field
 * @param fieldId - The ID of the field to fetch translations for
 * @returns Promise with the field translations
 */
export const axGetFieldTranslations = async (fieldId: number) => {
  try {
    // Update the endpoint to match your existing API
    const response = await http.get(`${ENDPOINT.SPECIES}/v1/species/field/${fieldId}/translations`);

    // Map the response data to match the expected FieldTranslation interface
    const mappedTranslations = response.data.map((item) => ({
      languageId: item.languageId.toString(),
      header: item.header,
      description: item.description,
      urlIdentifier: item.urlIdentifier
    }));

    return {
      success: true,
      data: mappedTranslations
    };
  } catch (error) {
    console.error("Error fetching field translations:", error);
    return {
      success: false,
      data: null,
      error
    };
  }
};

export const axUpdateSpeciesTaxonId = async (speciesId: number, newTaxonId: number) => {
  try {
    await waitForAuth();
    const { data } = await http.put(
      `${ENDPOINT.SPECIES}/v1/species/update/${speciesId}/${newTaxonId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error("Failed to update species taxon ID:", e);
    return { success: false, data: null };
  }
};
