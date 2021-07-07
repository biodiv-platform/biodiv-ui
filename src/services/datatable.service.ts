import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";

export const axGetDataTableList = async (params = {}) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.DATATABLE}/v1/services/list`, { params });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
