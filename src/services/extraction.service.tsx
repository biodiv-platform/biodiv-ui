import http from "@utils/http";

export const axExtractAllParams = async (params) => {
  try {
    const { data } = await http.get(`http://127.0.0.1:5000/extract`, {
      params
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, data: {} };
  }
};
