import { ENDPOINT } from "@static/constants";
import { fetchWithCache } from "@utils/cached-fetch";
import { plainHttp } from "@utils/http";

export const axGetLicenseList = async () => {
  try {
    const data = await fetchWithCache(`${ENDPOINT.RESOURCES}/v1/license/all`);
    return {
      success: true,
      data: data.map((o) => ({ label: o.name, value: o.id.toString(), url: o.url }))
    };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axGetResourcesByObjectId = async (objectType: string, objectId: number) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.RESOURCES}/v1/resource/getpath/${objectType}/${objectId}`
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
