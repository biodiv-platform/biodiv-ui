import SITE_CONFIG from "@configs/site-config";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import {
  axBulkUploadObservationResource,
  axListMyUploads,
  axRemoveMyUploads,
  axUploadObservationResource
} from "@services/files.service";
import { EXIF_GPS_FOUND, FORM_DATEPICKER_CHANGE } from "@static/events";
import { STORE } from "@static/observation-create";
import { setupDB } from "@utils/db";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { emit } from "react-gbus";
import { useImmer } from "use-immer";
import { useIndexedDBStore } from "use-indexeddb";

import { MY_UPLOADS_SORT } from "../options";

interface ObservationCreateContextProps {
  fieldName?: string;
  observationAssets?: IDBObservationAsset[];
  assets?: IDBObservationAsset[];
  addAssets?;
  setObservationAssets?;
  removeAsset?;
  addToObservationAssets?;
  removeObservationAsset?;
  updateObservationAsset?;
  uploadPendingResource?;
  children?;
  isCreate?;
  resourcesSortBy?;
  setResourcesSortBy?;
  licensesList?;
}

const ObservationCreateContext = createContext<ObservationCreateContextProps>(
  {} as ObservationCreateContextProps
);

export const ObservationCreateProvider = (props: ObservationCreateContextProps) => {
  const [observationAssets, setObservationAssets] = useImmer({ a: props.observationAssets || [] });
  const [assets, setAssets] = useImmer({ a: props.assets || [] });
  const [resourcesSortBy, setResourcesSortBy] = useState(MY_UPLOADS_SORT[0].value);
  const { t } = useTranslation();
  const { add, getOneByKey, getManyByKey, deleteByID, update } =
    useIndexedDBStore<IDBObservationAsset>(STORE.ASSETS);

  const reFetchAssets = async () => {
    const allUnUsedAssets = await getManyByKey("isUsed", 0);
    setAssets((_draft) => {
      _draft.a = allUnUsedAssets.sort((a, b) => b[resourcesSortBy] - a[resourcesSortBy]);
    });
  };

  useEffect(() => {
    reFetchAssets();
  }, [resourcesSortBy]);

  const fetchMyUploads = async () => {
    const { data } = await axListMyUploads();

    // housekeeping for expired assets
    const newAssetsHashKeys = data.map((a) => a.hashKey);
    const allUnUsedAssets = await getManyByKey("isUsed", 0);
    for (const asset of allUnUsedAssets) {
      if (!newAssetsHashKeys.includes(asset.hashKey) && asset.status === AssetStatus.Uploaded) {
        await deleteByID(asset.id);
      }
    }

    // Update all fetched assets into IndexedDB
    for (const asset of data) {
      const dbAsset = await getOneByKey("hashKey", asset.hashKey);
      if (!dbAsset) {
        await add({
          ...asset,
          status: AssetStatus.Uploaded,
          url: null,
          contributor: "",
          caption: "",
          rating: 0,
          licenseId: SITE_CONFIG.LICENSE.DEFAULT,
          isUsed: 0
        });
      }
    }

    await reFetchAssets();
  };

  useEffect(() => {
    setupDB();
    fetchMyUploads();
  }, []);

  const updateLocalAssetStatus = async (hashKey, status: AssetStatus) => {
    setAssets((_draft) => {
      const index = _draft.a.findIndex((a) => a.hashKey === hashKey);
      if (index > -1) {
        _draft.a[index].status = status;
      }
    });
    setObservationAssets((_draft) => {
      const index = _draft.a.findIndex((a) => a.hashKey === hashKey);
      if (index > -1) {
        _draft.a[index].status = status;
      }
    });
  };

  const handleZipFiles = async (pendingResource) => {
    try {
      const r = await axBulkUploadObservationResource(pendingResource);
      if (r) {
        await deleteByID(pendingResource.id);
        await fetchMyUploads();
        await updateLocalAssetStatus(pendingResource.hashKey, AssetStatus.Uploaded);
      }
    } catch (e) {
      console.error(e);
      notification(t("observation:delete_file.error"), NotificationType.Error);
    }
  };

  const handleMediaFiles = async (pendingResource, noSave) => {
    try {
      const r = await axUploadObservationResource(pendingResource);
      if (r.success && noSave) {
        await update({
          ...pendingResource,
          status: AssetStatus.Uploaded
        });
        await updateLocalAssetStatus(pendingResource.hashKey, AssetStatus.Uploaded);
      }
    } catch (e) {
      console.error(e);
      if (noSave) {
        await updateLocalAssetStatus(pendingResource.hashKey, AssetStatus.Pending);
      }
    }
  };

  const uploadPendingResource = async (pendingResource, noSave = true) => {
    if (noSave) {
      await updateLocalAssetStatus(pendingResource.hashKey, AssetStatus.InProgress);
    }

    if (["application/zip", "application/x-zip-compressed"].includes(pendingResource.type)) {
      handleZipFiles(pendingResource);
    } else {
      handleMediaFiles(pendingResource, noSave);
    }
  };

  const tryResourceSync = async () => {
    const pendingResources = await getManyByKey("status", AssetStatus.Pending);
    for (const pendingResource of pendingResources) {
      await uploadPendingResource(pendingResource);
    }
  };

  useEffect(() => {
    assets.a.length && tryResourceSync();
  }, [assets.a.length]);

  const addToObservationAssets = async (hashKey) => {
    const a = await getOneByKey("hashKey", hashKey);

    if (a?.dateCreated) {
      emit(FORM_DATEPICKER_CHANGE + "observedOn", a?.dateCreated);
    }
    if (a?.latitude && a?.longitude) {
      emit(EXIF_GPS_FOUND, { lat: a.latitude, lng: a.longitude });
    }

    setObservationAssets((_draft) => {
      _draft.a.push(a);
    });
  };

  const addAssets = async (newAssets, addToObservation) => {
    await Promise.all(newAssets.map((o) => add(o)));
    await reFetchAssets();
    if (addToObservation) {
      newAssets.forEach(({ hashKey }) => addToObservationAssets(hashKey));
    }
  };

  const removeAsset = async (asset) => {
    const { success } = await axRemoveMyUploads(asset);
    if (success) {
      await deleteByID(asset.id);
      await reFetchAssets();
      notification(t("observation:delete_file.success"), NotificationType.Success);
    } else {
      notification(t("observation:delete_file.failed"), NotificationType.Error);
    }
  };

  const removeObservationAsset = async (hashKey) => {
    setObservationAssets((_draft) => {
      const index = _draft.a.findIndex((o) => o.hashKey === hashKey);
      _draft.a.splice(index, 1);
    });
  };

  const updateObservationAsset = async (index, hashKey, key, value) => {
    if (props.isCreate) {
      const asset = await getOneByKey("hashKey", hashKey);
      await update({ ...asset, [key]: value });
    }
    setObservationAssets((_draft) => {
      _draft.a[index][key] = value;
    });
  };

  return (
    <ObservationCreateContext.Provider
      value={{
        observationAssets: observationAssets.a,
        assets: assets.a,
        setObservationAssets,
        addAssets,
        removeAsset,
        addToObservationAssets,
        removeObservationAsset,
        updateObservationAsset,
        uploadPendingResource,
        resourcesSortBy,
        setResourcesSortBy,
        licensesList: props.licensesList
      }}
    >
      {props.children}
    </ObservationCreateContext.Provider>
  );
};

export default function useObservationCreate() {
  return useContext(ObservationCreateContext);
}
