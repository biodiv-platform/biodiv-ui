import { ENDPOINT } from "@static/constants";
import http from "@utils/http";

export const axQueryGeoEntitiesByPlaceName = async (palcename) => {
  try {
    const { data } = await http.get(`${ENDPOINT.GEOENTITIES}/v1/services/read/placename`, {
      params: { palcename }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
