import { ENDPOINT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { plainHttp } from "@utils/http";

export const axGetDataTableList = async (params = {}) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.DATATABLE}/v1/services/list`, { params });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axAddDataTableComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.DATATABLE}/v1/services/comment/add`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axUserGroupDatatableUpdate = async (datatableId, groupList) => {
  try {
    const { data } = await http.put(
      `${ENDPOINT.OBSERVATION}/v1/observation/update/userGroup/datatable/${datatableId}`,
      {
        userGroupList: groupList,
        bulkAction: ""
      }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
