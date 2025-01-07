import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";

export const axCreateTrait = async (params) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.TRAITS}/v1/factservice/trait/create`,
      {}, // Empty object for request body if not needed
      { params }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axUpdateTrait = async (params, traitValues) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.TRAITS}/v1/factservice/trait/update`,
      { traitValues },
      { params }
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

export const axGetTraitShowData = async (traitId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TRAITS}/v1/factservice/trait/${traitId}`, {});
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};
