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
    const { data } = await plainHttp.get(`${ENDPOINT.API}/taxon/list`, {
      params: {
        classSystem: process.env.NEXT_PUBLIC_TAXON_ROOT,
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
    const { data } = await plainHttp.get(`${ENDPOINT.API}/taxon/retrieve/specificSearch`, {
      params: { term }
    });
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
