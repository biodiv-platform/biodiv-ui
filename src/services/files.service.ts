import { IDBObservationAsset } from "@interfaces/custom";
import { MyCsvUpload, MyUpload } from "@interfaces/files";
import { ENDPOINT, RESOURCE_TYPE } from "@static/constants";
import { LOCAL_ASSET_PREFIX } from "@static/observation-create";
import http from "@utils/http";
import { nanoid } from "nanoid";

export const axListMyUploads = async (module = RESOURCE_TYPE.OBSERVATION) => {
  try {
    const { data } = await http.get(`${ENDPOINT.FILES}/upload/my-uploads`, { params: { module } });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axRemoveMyUploads = async ({ path }) => {
  try {
    await http.post(`${ENDPOINT.FILES}/upload/remove-file`, {
      path
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axUploadObservationResource = async (
  resource: IDBObservationAsset,
  module = "observation"
) => {
  try {
    const formData = new FormData();
    formData.append("hash", resource.hashKey);
    formData.append("module", module);
    formData.append("upload", resource.blob, resource.fileName);

    const { data } = await http.post(`${ENDPOINT.FILES}/upload/my-uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axBulkUploadObservationResource = async (resource: IDBObservationAsset) => {
  const formData = new FormData();
  formData.append("folder", "myUploads");
  formData.append("module", "OBSERVATION");
  formData.append("upload", resource.blob, resource.fileName);

  const { data } = await http.post(`${ENDPOINT.FILES}/upload/bulk-upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

export const axUploadDocumentResource = async (document: File): Promise<MyUpload> => {
  const formData = new FormData();
  formData.append("hash", LOCAL_ASSET_PREFIX + nanoid());
  formData.append("module", "document");
  formData.append("upload", document, document.name);

  const { data } = await http.post(`${ENDPOINT.FILES}/upload/my-uploads`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

export const axUploadCsvCurationResource = async (document: File): Promise<MyCsvUpload> => {
  const formData = new FormData();
  formData.append("hash", "curate-" + nanoid());
  formData.append("module", "curation");
  formData.append("upload", document, document.name);

  const { data } = await http.post(`${ENDPOINT.FILES}/upload/my-uploads`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

/**
 * Used for uploading `userGrpoup` logo
 *
 * @param {IDBObservationAsset} resource
 * @returns
 */
export const axUploadResource = async (resource: File, directory, nestedPath?: string) => {
  try {
    const formData = new FormData();
    formData.append("hash", nanoid());
    formData.append("upload", resource, resource.name);
    formData.append("directory", directory);
    formData.append("resource", "true");
    nestedPath && formData.append("nestedFolder", nestedPath);

    const { data } = await http.post(`${ENDPOINT.FILES}/upload/resource-upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return { success: true, data: data.uri };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};
