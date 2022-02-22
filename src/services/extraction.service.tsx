import http from "@utils/http";

export const axExtractAllParams = async (d) => {
  try {
    const formData = new FormData();
    formData.append("sname", d.sname);
    formData.append("location", d.location);
    formData.append("date", d.date);
    formData.append("path", d.filePath);
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
