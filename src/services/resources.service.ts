import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";

export const axGetLicenseList = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.RESOURCES}/v1/license/all`);
    return {
      success: true,
      data: data.map((o) => ({ label: o.name, value: o.id.toString(), url: o.url }))
    };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
