import SITE_CONFIG from "@configs/site-config";
import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import { fetchWithCache } from "@utils/cached-fetch";
import http, { formDataHeaders, plainHttp } from "@utils/http";
import * as qs from "qs";

export const axGetspeciesGroups = async () => {
  try {
    const data = await fetchWithCache(`${ENDPOINT.OBSERVATION}/v1/observation/species/all`);
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
    console.error(e);
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
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetCropResources = async (observationId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/crop/resources/${observationId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

// FOR UPDATING THE CROP RESOURCES
export const axUpdateCropResources = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/crop/resources/${payload.id}`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
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

export const axGetTraitsByGroupId = async (groupId, languageId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/species/${groupId}/${languageId}`
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
      valueList
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
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
    console.error(e?.response?.data);
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

export const axGetCreateObservationPageData = async (userGroupId, ctx) => {
  try {
    const { data } = await http.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/usergroup/createObservation/${userGroupId}`,
      { params: { ctx } }
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};
export const axCreateObservation = async ({
  currentGroup,
  resources,
  customFieldList: customFieldData,
  ...payload
}) => {
  try {
    const newResources = resources.map((r) => ({
      path: r.path,
      url: r.url,
      type: r.type,
      contributor: r.contributor,
      caption: r.caption,
      rating: r.rating,
      licenseId: r.licenseId,
      languageId: r.languageId
    }));

    const endpoint = customFieldData
      ? `${ENDPOINT.OBSERVATION}/v1/observation/create/ugContext`
      : `${ENDPOINT.OBSERVATION}/v1/observation/create`;
    const body = customFieldData
      ? { customFieldData, observationData: { ...payload, resources: newResources } }
      : { ...payload, resources: newResources };
    const { data } = await http.post(endpoint, body);

    return { success: true, data };
  } catch (e) {
    if (e.response.status === 400) {
      alert(e.response.data);
    }
    console.error(e.response);
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

export const axBulkObservationData = async (payload) => {
  try {
    const { data } = await http.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/bulk/observation`,
      payload
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false };
  }
};

export const axGetListData = async (
  params,
  payload = {},
  index = "extended_observation",
  type = "_doc"
) => {
  try {
    const { data } = await plainHttp.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/list/${index}/${type}`,
      payload,
      {
        params
      }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
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

export const axDownloadFilteredObservations = async (params) => {
  try {
    await http.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/listcsv/extended_observation/extended_records`,
      { params }
    );
    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

export const axGetUserLifeList = async (userId, type, params) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/userinfo/${type}/${userId}`,
      {
        params
      }
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const axGetObservationMapData = async (params, payload = {}, actions = false) => {
  try {
    const fetchHttp = actions ? http : plainHttp;
    const response = await fetchHttp.post(
      `${ENDPOINT.OBSERVATION}/v1/observation/list/extended_observation/_doc`,
      payload,
      { params }
    );
    return { success: true, data: response.data.geohashAggregation };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetObservationByDatatableId = async (observationId, params) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/dataTableObservation/${observationId}`,
      { params }
    );
    return { success: !!data, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};

export const axGetObservationListByDatatableId = async (observationId, params) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/dataTableObservation/list/${observationId}`,
      { params }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axDeleteObservationByDatatableId = async (observationId) => {
  try {
    const { data } = await http.delete(
      `${ENDPOINT.OBSERVATION}/v1/observation/dataTableObservation/${observationId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const getImageFilesAsBlobs = async (url) => {
  try {
    const data = await fetch(url);
    return data.blob();
  } catch (e) {
    console.error(e.response.data.message);
  }
};

export const axGetPlantnetSuggestions = async (imageUrls, organs) => {
  const queryParams = {
    "api-key": SITE_CONFIG.PLANTNET.API_KEY,
    "include-related-images": true
  };
  const params = qs.stringify(queryParams, { arrayFormat: "repeat" });
  const formData = new FormData();

  const responses: Blob[] = await Promise.all(imageUrls.map((i) => getImageFilesAsBlobs(i)));
  responses.forEach((r, index) => {
    formData.append("images", r);
    formData.append("organs", organs[index]);
  });

  try {
    const data = await plainHttp.post(`${SITE_CONFIG.PLANTNET.API_ENDPOINT}${params}`, formData, {
      headers: formDataHeaders
    });
    return { success: true, data: data.data };
  } catch (e) {
    return { success: false, data: [] };
  }
};

export const axGetGroupByDayCreatedOn = async (userId) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.OBSERVATION}/v1/observation/userTemporalAggregation/${userId}`
    );
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};
