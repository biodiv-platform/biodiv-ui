import { IDBObservationAsset } from "@interfaces/custom";
import { ENDPOINT } from "@static/constants";
import http from "@utils/http";

export const axListMyUploads = async () => {
  try {
    const { data } = await http.get(`${ENDPOINT.FILES}/upload/my-uploads`);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const axRemoveMyUploads = async ({ hashKey, fileName }) => {
  try {
    await http.post(`${ENDPOINT.FILES}/upload/remove-file`, {
      path: `${hashKey}/${fileName}`
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

export const axUploadResource = async (resource: IDBObservationAsset) => {
  const formData = new FormData();
  formData.append("hash", resource.hashKey);
  formData.append("upload", resource.blob, resource.fileName);
  const { data } = await http.post(`${ENDPOINT.FILES}/upload/my-uploads`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};

export const axUploadUserGroupResource = async (resource: IDBObservationAsset) => {
  const formData = new FormData();
  formData.append("hash", resource.hashKey);
  formData.append("upload", resource.blob, resource.fileName);
  formData.append("directory", "userGroups");
  formData.append("resource", "true");
  const { data } = await http.post(`${ENDPOINT.FILES}/upload/resource-upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};
