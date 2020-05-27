import { ENDPOINT, PAGINATION_LIMIT } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import http, { plainHttp } from "@utils/http";
import notification from "@utils/notification";

export const axListActivity = async (
  objectType,
  objectId,
  offset = 0,
  limit = PAGINATION_LIMIT
) => {
  try {
    const res = await plainHttp.get(
      `${ENDPOINT.ACTIVITY}/v1/service/ibp/${objectType}/${objectId}`,
      { params: { offset, limit } }
    );
    return {
      success: true,
      data: res.data.activity,
      offset: offset + res.data.activity.length,
      reset: offset === 0,
      hasMore: res.data.activity.length === limit,
      commentCount: res.data.commentCount
    };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axAddComment = async (payload) => {
  try {
    await waitForAuth();
    const { data } = await http.post(`${ENDPOINT.OBSERVATION}/v1/observation/add`, payload);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
