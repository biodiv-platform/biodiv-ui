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
    const { data } = await http.post(`http://localhost:5000/extract`, formData, {
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
    const { data } = await plainHttp.get(`http://localhost:5000/show/1/2`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};
