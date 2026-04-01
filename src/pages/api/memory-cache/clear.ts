import { clearFetchWithCache } from "@utils/cached-fetch";
import fs from "fs";
import path from "path";

export default function clear(_req, res) {
  try {
    clearFetchWithCache();
    const imageCachePath = path.join(process.cwd(), ".next", "cache", "images");
    let cleared = false;

    if (fs.existsSync(imageCachePath)) {
      fs.rmSync(imageCachePath, { recursive: true, force: true });
      cleared = true;
    }

    return res.status(200).json({
      status: "OK",
      cleared: {
        fetchCache: true,
        nextImageCache: cleared
      }
    });
  } catch (error) {
    console.error("Cache clear failed:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to clear caches",
      error: error.message
    });
  }
}
