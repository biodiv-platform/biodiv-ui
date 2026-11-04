import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";

/**
 * GBIF occurrences matched to an IBP taxon, counted per geohash cell inside the map bounds
 *
 * @returns {geohash: count} for a naksha grid layer
 */
export const axGetGBIFTaxonGrid = async (
  taxonId,
  { top, left, bottom, right, geoAggegationPrecision }
) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.EXTERNAL_OCCURRENCES}/v1/gbif/taxon/${taxonId}/grid`,
      { params: { top, left, bottom, right, precision: geoAggegationPrecision } }
    );
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: {} };
  }
};
