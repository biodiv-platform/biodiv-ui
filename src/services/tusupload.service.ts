import { IDBObservationAsset } from "@interfaces/custom";
import { ENDPOINT } from "@static/constants";
import { LOCAL_ASSET_PREFIX } from "@static/observation-create";
import http, { getBearerToken } from "@utils/http";
import { nanoid } from "nanoid";
import * as tus from "tus-js-client";

// Stay comfortably under Cloudflare's 100MB proxy limit per request/chunk.
const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB

export const MAX_UPLOAD_SIZE = 3 * 1024 * 1024 * 1024; // 3 GB

// Files at or above this size go through tus; smaller ones keep using the
// existing multipart POST endpoints unchanged.
export const TUS_THRESHOLD_BYTES = 90 * 1024 * 1024; // 90MB

/**
 * Generic tus upload core. Every specific upload type (observation, document,
 * curation CSV) wraps this with its own hash/module conventions and return shape.
 */
async function tusUploadFile(
  blob: Blob,
  fileName: string,
  module: string,
  hash: string,
  onProgress?: (percent: number) => void,
  endpoint: string = `${ENDPOINT.FILES}/upload/tus`,
  extraMetadata: Record<string, string> = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(blob, {
      endpoint,
      chunkSize: CHUNK_SIZE,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      removeFingerprintOnSuccess: true,
      metadata: {
        filename: fileName,
        filetype: blob.type,
        module,
        hash,
        ...extraMetadata
      },
      onBeforeRequest: async (req) => {
        const token = await getBearerToken();
        if (token) {
          req.setHeader("Authorization", token);
        }
      },
      onError: (error) => reject(error),
      onProgress: (bytesUploaded, bytesTotal) => {
        onProgress?.(Math.round((bytesUploaded / bytesTotal) * 100));
      },
      onSuccess: async () => {
        try {
          resolve(await pollForResult(upload.url!));
        } catch (err) {
          reject(err);
        }
      }
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  });
}

async function pollForResult(uploadUrl: string, attempts = 20): Promise<any> {
  for (let i = 0; i < attempts; i++) {
    const { data } = await http.get(`${uploadUrl}/result`);
    if (data.complete) {
      if (data.result?.error) throw new Error(data.result.error);
      return data.result;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Upload finalization timed out");
}

/**
 * Same call signature / return shape as axUploadObservationResource, so it's
 * a drop-in swap in handleMediaFiles based on file size.
 */
export const axTusUploadObservationResource = async (
  resource: IDBObservationAsset,
  module = "observation",
  onProgress?: (percent: number) => void
) => {
  try {
    const rawData = await tusUploadFile(
      resource.blob,
      resource.fileName ?? `${resource.hashKey}.bin`,
      module,
      resource.hashKey,
      onProgress
    );

    const data = unwrapSingle(rawData);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
// Helper to safely unwrap single-element TUS upload responses
const unwrapSingle = (res: any) => {
  if (!res) return res;

  // If response structure is { success: true, data: [...] }
  if (res.data && Array.isArray(res.data)) {
    return { ...res, data: res.data[0] };
  }

  // If response is a direct array [...]
  if (Array.isArray(res)) {
    return res[0];
  }

  return res;
};

/**
 * Same call signature / return shape as axUploadDocumentResource — returns
 * MyUpload directly, throws on failure (caller doesn't currently try/catch).
 */
export const axTusUploadDocumentResource = async (document: File, onProgress?: any) => {
  const res = await tusUploadFile(
    document,
    document.name,
    "document",
    LOCAL_ASSET_PREFIX + nanoid(),
    onProgress
  );

  // Unwrap [MyUpload] -> MyUpload
  const singleRes = unwrapSingle(res);
  return singleRes?.data ?? singleRes;
};

/**
 * Same call signature / return shape as axUploadCSVCurationResource.
 */
export const axTusUploadCSVCurationResource = async (file: File, onProgress?: any) => {
  const res = await tusUploadFile(
    file,
    file.name,
    "observation",
    LOCAL_ASSET_PREFIX + nanoid(),
    onProgress
  );

  const singleRes = unwrapSingle(res);
  return singleRes?.data ?? singleRes;
};

/**
 * TUS equivalent of handleBulkUpload.
 * Uploads an array of files (including ZIP archives) via TUS, tracks overall
 * progress, and flattens the returned List<MyUpload> from the backend.
 */
export const axTusBulkUpload = async (
  files: File[],
  module: string = "observation",
  onProgress?: (overallPercent: number) => void
): Promise<{ status: boolean; files: any[] }> => {
  try {
    if (!files || files.length === 0) {
      return { status: false, files: [] };
    }

    const totalFiles = files.length;
    const progressMap = new Array<number>(totalFiles).fill(0);

    // Upload all files concurrently using tusUploadFile
    const uploadPromises = files.map((file, index) => {
      const hashKey = `${LOCAL_ASSET_PREFIX}${nanoid()}`;

      return tusUploadFile(file, file.name, module, hashKey, (filePercent) => {
        progressMap[index] = filePercent;
        const overallPercent = Math.round(
          progressMap.reduce((sum, val) => sum + val, 0) / totalFiles
        );
        onProgress?.(overallPercent);
      });
    });

    const results = await Promise.all(uploadPromises);

    // Each TUS result is List<MyUpload> (Array). Flatten them into a single list.
    const allSavedFiles: any[] = [];
    results.forEach((res) => {
      if (Array.isArray(res)) {
        allSavedFiles.push(...res);
      } else if (res) {
        allSavedFiles.push(res);
      }
    });

    return {
      status: allSavedFiles.length > 0,
      files: allSavedFiles
    };
  } catch (error) {
    console.error("TUS Bulk Upload Error:", error);
    return { status: false, files: [] };
  }
};

/**
 * Uploads one layer file (shp/dbf/shx/prj/csv/tif/sld). `hash` is shared across
 * every file in one layer-upload attempt so naksha-integrator can land them in
 * the same directory; `fileRole` tells it which piece this file is.
 */
export const axTusUploadLayerFile = async (
  file: File,
  hash: string,
  fileRole: string,
  onProgress?: (percent: number) => void
) => {
  return tusUploadFile(
    file,
    file.name,
    "layer",
    hash,
    onProgress,
    `${ENDPOINT.NAKSHA}/layer/upload/tus`,
    { fileRole }
  );
};

/**
 * Called once, after all required files for the attempt have finished
 * uploading and the form has been filled in. Sends only JSON — no file bytes.
 */
export const axFinalizeLayerUpload = async (hash: string, metadata: any) => {
  const { data } = await http.post(`${ENDPOINT.NAKSHA}/layer/upload/${hash}`, metadata);
  return data;
};
