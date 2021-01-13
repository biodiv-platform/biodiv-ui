import { ENDPOINT } from "@static/constants";
import { readCache, writeCache } from "@utils/disk-cache";
import { transformUserGroupList } from "@utils/userGroup";

const DISK_FILE = "groups.json";
const API_ENDPOINT = `${ENDPOINT.USERGROUP}/v1/group/all`;

/**
 * `/group/all` is executed every time when any page
 * navigated/preloaded due to `getInitialProps()` in `_app.tsx`
 *
 * so this will add an disk based cache for fast retrival
 * with fallback to fetch request
 *
 * cache can be revalidated using `force=1` query param
 */
const groupsApi = async (req, res) => {
  let data = await readCache(DISK_FILE);

  if (!data || req.query.force) {
    const r = await fetch(API_ENDPOINT);
    data = transformUserGroupList(await r.json());
    await writeCache(DISK_FILE, data);
  }

  res.json(data);
};

export default groupsApi;
