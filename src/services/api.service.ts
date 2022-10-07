import SITE_CONFIG from "@configs/site-config";
import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";

/**
 * This function is written for legacy support when migration happens to microservices
 * please remove this and ask for property named `key` (alias of `id`) as a string
 *
 * @param {*} list
 */
const keyToString = (list) =>
  list.map((item) => {
    const itemNew = { ...item, key: item.id.toString() };
    return item?.children ? { ...itemNew, children: keyToString(item.children) } : itemNew;
  });

export const axGetTaxonList = async ({ key = "", taxonIds = "", expand_taxon = false }) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.TAXONOMY}/v1/tree/list`, {
      params: {
        classification: SITE_CONFIG.TAXONOMY.CLASSIFICATION_ID,
        parent: key,
        expand_taxon,
        taxonIds
      }
    });
    return keyToString(data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * returns Array of Taxon IDs based on term (text search)
 *
 * @param {*} term
 * @returns
 */
export const doTaxonSearch = async (term) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.TAXONOMY}/v1/taxonomy/retrieve/specificSearch`,
      { params: { term } }
    );
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * removes `memory-cache` data from memory
 *
 */
export const axClearMemoryCache = async () => {
  try {
    await plainHttp.get(`${ENDPOINT.API}/memory-cache/clear`);
  } catch (e) {
    console.error(e);
  }
};

/**
 * predicts species group from image
 *
 */
export const axGetSpeciesGroup = async (url) => {
  try {
    const response = await plainHttp.post(`${ENDPOINT.API}/predict`, { input: { image: url } });
    return { success: true, data: response.data.output };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
