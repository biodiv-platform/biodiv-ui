import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";

export const axCreateTrait = async (params) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.TRAITS}/v1/factservice/trait/create`,
      params, // Empty object for request body if not needed
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateTrait = async (id, translations) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.TRAITS}/v1/factservice/trait/update/${id}`,
      translations,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateSpeciesTrait = async (id, newFacts, userId, taxonId) => {
  try {
    const { data } = await plainHttp.put(
      `${ENDPOINT.TRAITS}/v1/factservice/update/species.Species/${id}?userId=${userId}&taxonId=${taxonId}`,
      newFacts,
      {
        headers: {
          "Content-Type": "application/json" // Important for file uploads
        }
      }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetTraitShowData = async (traitId, languageId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.TRAITS}/v1/factservice/trait/${traitId}/${languageId}`,
      {}
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetTraitNames = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TRAITS}/v1/factservice/trait/list`, {});
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetTraitListData = async (languageId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.SPECIES}/v1/species/traits/${languageId}`, {});
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetTraitTranslationData = async (traitId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TRAITS}/v1/factservice/trait/${traitId}`, {});
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axUploadTraitsFile = async (formData) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.TRAITS}/v1/factservice/upload/batch-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data" // Important for file uploads
        }
      }
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};
