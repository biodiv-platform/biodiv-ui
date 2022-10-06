import SITE_CONFIG from "@configs/site-config";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import {
  axListMyUploads,
  axRemoveMyUploads,
  axUploadObservationResource
} from "@services/files.service";
import { OBSERVATION_IMPORT_DIALOUGE } from "@static/events";
import { AUTOCOMPLETE_FIELDS, GEOCODE_OPTIONS } from "@static/location";
import { STORE } from "@static/observation-create";
import { getLocalIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import { clusterResources } from "@utils/observation";
import useTranslation from "next-translate/useTranslation";
import React, { createContext, useContext, useMemo, useState } from "react";
import { emit } from "react-gbus";
import { usePlacesWidget } from "react-google-autocomplete";
import { useIndexedDBStore } from "use-indexeddb";

import { MY_UPLOADS_SORT } from "../create/form/options";

interface ObservationCreateNextContextProps {
  observationCreateFormData;
  speciesGroups;
  speciesGroupOptions;
  languages;
  licensesList;

  showMediaPicker;
  setShowMediaPicker;

  sortedCFList;

  draft: {
    all;
    get;
    add;
    remove;
    sortBy;
    setSortBy;
  };

  media: {
    keys;
    setKeys;
    disabledKeys;
    setDisabledKeys;
    selected;
    status;
    toggleSelection;
    sync;
  };
}

interface ObservationCreateNextProviderProps {
  observationCreateFormData;
  speciesGroups;
  languages;
  licensesList;

  children;
}

const ObservationCreateNextContext = createContext<ObservationCreateNextContextProps>(
  {} as ObservationCreateNextContextProps
);

export const ObservationCreateNextProvider = ({
  observationCreateFormData,
  speciesGroups,
  languages,
  licensesList,

  children
}: ObservationCreateNextProviderProps) => {
  const [showMediaPicker, setShowMediaPicker] = useState<boolean>();

  const { t } = useTranslation();
  const [draftList, setDraftList] = useState<any[]>([]);
  const [draftUploadStatus, setDraftUploadStatus] = useState({});
  const [draftDisabled, setDraftDisabled] = useState<string[]>([]);
  const [selectedHKs, setSelectedHKs] = useState<string[]>([]);
  const [draftSortBy, setDraftSortBy] = useState(MY_UPLOADS_SORT[0].value);

  // initialising autocomplete to init google maps
  // for background reverse geocoder to work
  const { ref }: any = usePlacesWidget({
    apiKey: SITE_CONFIG.TOKENS.GMAP,
    onPlaceSelected: console.debug,
    options: { ...GEOCODE_OPTIONS, fields: AUTOCOMPLETE_FIELDS, types: "regions" }
  });

  const speciesGroupOptions = useMemo(
    () =>
      speciesGroups.map((sg) => ({
        label: sg.name,
        value: sg.id,
        image: getLocalIcon(sg.name),
        ...sg
      })),
    []
  );

  const sortedCFList = useMemo(
    () => observationCreateFormData?.customField?.sort((a, b) => a.displayOrder - b.displayOrder),
    []
  );

  const { add, getOneByKey, getManyByKey, getAll, deleteByID, update } =
    useIndexedDBStore<IDBObservationAsset>(STORE.ASSETS);

  const selectedMediaList = useMemo(
    () => draftList.filter((dr) => selectedHKs.includes(dr.hashKey)),
    [selectedHKs, draftList]
  );

  const refreshDraftMediaFromIdb = async () => {
    const allUnUsedAssets = await getManyByKey("isUsed", 0);
    const _draftList = allUnUsedAssets.sort((a, b) => b[draftSortBy] - a[draftSortBy]);
    setDraftList(_draftList);

    setDraftUploadStatus(Object.fromEntries(_draftList.map((r) => [r.hashKey, r.status])));

    return _draftList;
  };

  /**
   * Retrives list of draft media from endpoint and adds/updates/removes into IndexedDB
   *
   */
  const getDrafts = async () => {
    const { data } = await axListMyUploads();

    // housekeeping for expired assets
    const newMediaHashKeys = data.map((a) => a.hashKey);
    const allUnUsedMedia = await getManyByKey("isUsed", 0);
    for (const asset of allUnUsedMedia) {
      if (!newMediaHashKeys.includes(asset.hashKey) && asset.status === AssetStatus.Uploaded) {
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

    await refreshDraftMediaFromIdb();
  };

  const updateIdbMediaStatus = async (hashKey, status: AssetStatus) => {
    setDraftList(draftList.map((a) => (a.hashKey === hashKey ? { ...a, status } : a)));

    setDraftUploadStatus({ ...draftUploadStatus, [hashKey]: status });
  };

  const uploadPendingMedia = async (pendingMedia, noSave = true) => {
    if (noSave) {
      await updateIdbMediaStatus(pendingMedia.hashKey, AssetStatus.InProgress);
    }

    try {
      const r = await axUploadObservationResource(pendingMedia);
      if (noSave) {
        const _status = r.success ? AssetStatus.Uploaded : AssetStatus.Failed;

        await update({
          ...pendingMedia,
          blob: r.success ? undefined : pendingMedia.blob,
          status: _status
        });
        await updateIdbMediaStatus(pendingMedia.hashKey, _status);

        return _status;
      }
    } catch (e) {
      console.error(e);
      if (noSave) {
        await updateIdbMediaStatus(pendingMedia.hashKey, AssetStatus.Failed);
      }
    }

    return false;
  };

  /**
   * Picks all pending media and tries to upload
   *
   */
  const tryMediaSync = async (_status: AssetStatus = AssetStatus.Pending) => {
    const pendingMedia = await getAll();
    for (const _media of pendingMedia) {
      if (_media.status === _status) {
        await uploadPendingMedia(_media);
      }
    }
    await refreshDraftMediaFromIdb();
  };

  const addToDrafts = async (newMedia, addToObservation) => {
    setDraftDisabled([...draftDisabled, ...newMedia.map((o) => o.hashKey)]);

    await Promise.all(newMedia.map((_media) => add(_media)));

    if (addToObservation) {
      emit(OBSERVATION_IMPORT_DIALOUGE, clusterResources(newMedia));
    }

    tryMediaSync();
  };

  const toggleDraftSelection = (hashKey, add) => {
    if (add) {
      setSelectedHKs([...selectedHKs, hashKey]);
    } else {
      setSelectedHKs(selectedHKs.filter((_hashKey) => hashKey !== _hashKey));
    }
  };

  const deleteFromDrafts = async (asset) => {
    const { success } = await axRemoveMyUploads(asset);
    if (success) {
      await deleteByID(asset.id);
      await refreshDraftMediaFromIdb();
      notification(t("observation:delete_file.success"), NotificationType.Success);
    } else {
      notification(t("observation:delete_file.failed"), NotificationType.Error);
    }
  };

  return (
    <ObservationCreateNextContext.Provider
      value={{
        observationCreateFormData,
        speciesGroups,
        speciesGroupOptions,
        languages,
        licensesList,

        showMediaPicker,
        setShowMediaPicker,

        sortedCFList,

        draft: {
          all: draftList,
          get: getDrafts,
          add: addToDrafts,
          remove: deleteFromDrafts,
          sortBy: draftSortBy,
          setSortBy: setDraftSortBy
        },
        media: {
          keys: selectedHKs,
          setKeys: setSelectedHKs,
          disabledKeys: draftDisabled,
          setDisabledKeys: setDraftDisabled,
          status: draftUploadStatus,
          selected: selectedMediaList,
          toggleSelection: toggleDraftSelection,
          sync: tryMediaSync
        }
      }}
    >
      <input ref={ref} type="hidden" />
      {children}
    </ObservationCreateNextContext.Provider>
  );
};

export default function useObservationCreateNext() {
  return useContext(ObservationCreateNextContext);
}
