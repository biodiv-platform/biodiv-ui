import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { formDataHeaders, plainHttp } from "@utils/http";

export const axExtractAllParams = async (d) => {
  try {
    const formData = new FormData();
    formData.append("sname", d.sname);
    formData.append("location", d.location);
    formData.append("date", d.date);
    formData.append("path", d.filePath);
    formData.append("userId", d.userId);
    formData.append("title", d.title);
    formData.append("datasetDescription", d.summary);

    const cIds = d.contributors.map((v) => v.value);
    const validatorIds = d.validators.map((v) => v.value);

    formData.append("contributorsIds", cIds);
    formData.append("validatorIds", validatorIds);

    const { data } = await http.post(`${ENDPOINT.CURATE}/extract`, formData, {
      headers: formDataHeaders
    });

    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axShowDataset = async (datasetId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.CURATE}/show/${datasetId}`);

    return { success: true, data: data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axUpdateDataset = async (payload) => {
  try {
    const { data } = await http.put(`${ENDPOINT.CURATE}/update/`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axGetPeliasAutocompleteLocations = async (text) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.CURATE}/pelias/autocomplete`, {
      params: { text: text }
    });
    return data.map((l) => ({
      label: l.label,
      value: l.label,
      coordinates: l.coordinates,
      locationAccuracy: l.locationAccuracy
    }));
  } catch (e) {
    return { succces: false, data: [] };
  }
};

export const axDownloadCsv = async (id, curatedStatus) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.CURATE}/download/${id}`, {
      params: { curatedStatus: curatedStatus }
    });
    return { succes: true, data: data };
  } catch (e) {
    return { succces: false, data: [] };
  }
};

export const axGetDataSheetInfo = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.CURATE}/list`);
    return { succes: true, data: data };
  } catch (e) {
    return { succces: false, data: [] };
  }
};

export const axUpdateContributors = async (contributors, id, type) => {
  try {
    const cIds = contributors.map((v) => v.value);
    const ids = cIds.join(", ");
    const payload = { dataSheetId: id, users: ids };
    const { data } = await http.put(`${ENDPOINT.CURATE}/${type.toLowerCase()}`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};
