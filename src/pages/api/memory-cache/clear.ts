import { clearFetchWithCache } from "@utils/cached-fetch";

/**
 * removes `memory-cache` data from memory
 *
 */
export default function clear(_req, res) {
  clearFetchWithCache();
  res.status(200).json({ status: "OK" });
}
