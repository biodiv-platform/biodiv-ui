import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";

export const axGetTaxonRanks = async () => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TAXONOMY}/v1/rank/all`);
    return { success: true, data };
  } catch (e) {
    return { success: false, data: [] };
  }
};
