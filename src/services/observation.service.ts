import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { plainHttp } from "@utils/http";

export const axGetspeciesGroups = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.OBSERVATION}/v1/observation/species/all`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetObservationEditById = async (observationId, ctx) => {
  try {
    const { data } = await http.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/edit/${observationId}`,
      { params: { ctx } }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axGetObservationById = async (observationId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/show/${observationId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axQueryTagsByText = async (query) => {
  try {
    const { data } = await http.get(`${ENDPOINT.OBSERVATION}/v1/observation/tags/autocomplete`, {
      params: { phrase: query }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axUpdateObservationTags = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.put(`${ENDPOINT.OBSERVATION}/v1/observation/update/tags`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetTraitsByGroupId = async (groupId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/species/${groupId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axUpdateTraitById = async (observationId, traitId, valueList) => {
  try {
    await waitForAuth();
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/update/traits/${observationId}/${traitId}`,
      Array.isArray(valueList) ? valueList : [valueList]
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axUpdateSpeciesGroup = async (observationId, sGroupId) => {
  try {
    await waitForAuth();
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/speciesgroup/${observationId}/${sGroupId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetPermissions = async (observationId, taxonList) => {
  try {
    const { data } = await http.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/permissions/${observationId}`,
      {
        params: { taxonList }
      }
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axSaveUserGroups = async (observationId, userGroupList) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/update/usergroup/${observationId}`,
      userGroupList
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGroupsFeature = async (payload) => {
  try {
    const { data } = await http.post(`${ENDPOINT.OBSERVATION}/v1/observation/featured`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGroupsUnFeature = async (observationId, userGroupList) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/unfeatured/${observationId}`,
      userGroupList
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axRecoSuggest = async (observationId, payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/reco/create/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data);
    return { success: false, data: {} };
  }
};

export const axAgreeRecoVote = async (observationId, payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/reco/agree/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axRemoveRecoVote = async (observationId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/reco/remove/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axValidateRecoVote = async (observationId, payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/reco/validate/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axUnlockRecoVote = async (observationId, payload) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/reco/unlock/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axCreateObservation = async ({ resources, ...payload }) => {
  try {
    const newResources = resources.map((r) => ({
      path: r.path,
      url: r.url,
      type: r.type,
      caption: r.caption,
      rating: r.rating,
      licenceId: r.licenceId
    }));

    const { data } = await http.post(`${ENDPOINT.OBSERVATION}/v1/observation/create`, {
      ...payload,
      resources: newResources
    });

    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axUpdateObservation = async (payload, observationId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/update/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axFollowObservation = async (observationId, follow = true) => {
  const action = follow ? "follow" : "unfollow";
  try {
    await waitForAuth();
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/${action}/${observationId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axFlagObservation = async (observationId, payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/flag/${observationId}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axUnFlagObservation = async (observationId, flagId) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/unflag/${observationId}/${flagId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axDeleteObservation = async (observationId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.OBSERVATION}/v1/observation/delete/${observationId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: {} };
  }
};

export const axUpdateCustomField = async (payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/customField/insert`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetListData = async (
  params,
  index = "extended_observation",
  type = "extended_records"
) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/list/${index}/${type}`,
      {
        params
      }
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetMaxVotedRecoPermissions = async (payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/list/permissions/maxVotedReco`,
      payload
    );
    return {
      success: true,
      data: data.reduce((acc, cv) => ({ ...acc, [cv.observationId]: cv.permission }), {})
    };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetCustomFieldsPermissions = async (observationId, taxonList) => {
  try {
    const { data } = await http.post(
      `${
        ENDPOINT.OBSERVATION
      }/v1/observation/list/permissions/${observationId}?taxonList=${taxonList.toString()}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetObservationListConfig = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.OBSERVATION}/v1/observation/list/all`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetObservationsByResources = async (resources) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/find`,
      resources.toString()
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axRateObservationResource = async (observationId, resourceId, rating) => {
  try {
    await waitForAuth();
    await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/update/resource/rating/${observationId}`,
      { resourceId, rating }
    );
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
