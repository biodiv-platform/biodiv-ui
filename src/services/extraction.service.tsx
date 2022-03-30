import { ENDPOINT } from "@static/constants";
import http, { plainHttp } from "@utils/http";

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

    const contributors = d.contributors;
    const cIds = contributors.map((v) => v.value);

    formData.append("contributorsIds", cIds);
    const { data } = await http.post(`${ENDPOINT.CURATE}/extract`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axShowDataset = async (datasetId) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.CURATE}/show/1/${datasetId}`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};

export const axUpdateDataset = async (payload) => {
  try {
    const { data } = await http.put("${ENDPOINT.CURATE}/update/", payload); //1=dataset 2=row index
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};
