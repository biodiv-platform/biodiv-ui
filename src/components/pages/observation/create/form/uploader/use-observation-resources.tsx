import useTranslation from "@hooks/use-translation";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import {
  axListMyUploads,
  axRemoveMyUploads,
  axUploadObservationResource
} from "@services/files.service";
import { EXIF_GPS_FOUND, FORM_DATEPICKER_CHANGE } from "@static/events";
import { DEFAULT_LICENSE } from "@static/licenses";
import { STORE } from "@static/observation-create";
import notification, { NotificationType } from "@utils/notification";
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
  removeAsset?;
  addToObservationAssets?;
  removeObservationAsset?;
  updateObservationAsset?;
  uploadPendingResource?;
  children?;
  isCreate?;
  resourcesSortBy?;
  setResourcesSortBy?;
}

const ObservationCreateContext = createContext<ObservationCreateContextProps>(
  {} as ObservationCreateContextProps
);

export const ObservationCreateProvider = (props: ObservationCreateContextProps) => {
  const [observationAssets, setObservationAssets] = useImmer({ a: props.observationAssets || [] });
  const [assets, setAssets] = useImmer({ a: props.assets || [] });
  const [resourcesSortBy, setResourcesSortBy] = useState(MY_UPLOADS_SORT[0].value);
  const { t } = useTranslation();
  const {
    add,
    getOneByIndex,
    getManyByIndex,
    deleteByID,
    update
  } = useIndexedDBStore<IDBObservationAsset>(STORE.ASSETS);

  const reFetchAssets = async () => {
    const allUnUsedAssets = await getManyByIndex("isUsed", 0);
    setAssets((_draft) => {
      _draft.a = allUnUsedAssets.sort((a, b) => b[resourcesSortBy] - a[resourcesSortBy]);
    });
  };

  useEffect(() => {
    reFetchAssets();
  }, [resourcesSortBy]);

  const fetchMyUploads = async () => {
    const { data } = await axListMyUploads();

    if (!data.length) {
      return;
    }

    // housekeeping for expired assets
    const newAssetsHashKeys = data.map((a) => a.hashKey);
    const allUnUsedAssets = await getManyByIndex("isUsed", 0);
    for (const asset of allUnUsedAssets) {
      if (!newAssetsHashKeys.includes(asset.hashKey) && asset.status === AssetStatus.Uploaded) {
        await deleteByID(asset.id);
      }
    }

    // Update all fetched assets into IndexedDB
    for (const asset of data) {
      const dbAsset = await getOneByIndex("hashKey", asset.hashKey);
      if (!dbAsset) {
        await add({
          ...asset,
          status: AssetStatus.Uploaded,
          url: null,
          caption: "",
          rating: 0,
          licenceId: DEFAULT_LICENSE,
          isUsed: 0
        });
      }
    }

    await reFetchAssets();
  };

  useEffect(() => {
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

  const uploadPendingResource = async (pendingResource, noSave = true) => {
    if (noSave) {
      await updateLocalAssetStatus(pendingResource.hashKey, AssetStatus.InProgress);
    }
    try {
      const r = await axUploadObservationResource(pendingResource);
      if (r && noSave) {
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

  const tryResourceSync = async () => {
    const pendingResources = await getManyByIndex("status", AssetStatus.Pending);
    for (const pendingResource of pendingResources) {
      await uploadPendingResource(pendingResource);
    }
  };

  useEffect(() => {
    assets.a.length && tryResourceSync();
  }, [assets.a.length]);

  const addToObservationAssets = async (hashKey) => {
    const a = await getOneByIndex("hashKey", hashKey);

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
      notification(t("OBSERVATION.DELETE_FILE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("OBSERVATION.DELETE_FILE.FAILED"), NotificationType.Error);
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
      const asset = await getOneByIndex("hashKey", hashKey);
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
        addAssets,
        removeAsset,
        addToObservationAssets,
        removeObservationAsset,
        updateObservationAsset,
        uploadPendingResource,
        resourcesSortBy,
        setResourcesSortBy
      }}
    >
      {props.children}
    </ObservationCreateContext.Provider>
  );
};

export default function useObservationCreate() {
  return useContext(ObservationCreateContext);
}
