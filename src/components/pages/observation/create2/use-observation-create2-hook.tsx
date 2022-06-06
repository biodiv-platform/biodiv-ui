import SITE_CONFIG from "@configs/site-config";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import {
  axListMyUploads,
  axRemoveMyUploads,
  axUploadObservationResource
} from "@services/files.service";
import { OBSERVATION_IMPORT_RESOURCE } from "@static/events";
import { AUTOCOMPLETE_FIELDS, GEOCODE_OPTIONS } from "@static/location";
import { STORE } from "@static/observation-create";
import { getLocalIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { createContext, useContext, useMemo, useState } from "react";
import { emit } from "react-gbus";
import { usePlacesWidget } from "react-google-autocomplete";
import { useIndexedDBStore } from "use-indexeddb";

import { MY_UPLOADS_SORT } from "../create/form/options";

interface ObservationCreate2ContextProps {
  observationCreateFormData;
  speciesGroups;
  speciesGroupOptions;
  languages;
  licensesList;

  showMediaPicker;
  setShowMediaPicker;

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
    toggleSelection;
  };
}

interface ObservationCreate2ProviderProps {
  observationCreateFormData;
  speciesGroups;
  languages;
  licensesList;

  children;
}

const ObservationCreate2Context = createContext<ObservationCreate2ContextProps>(
  {} as ObservationCreate2ContextProps
);

export const ObservationCreate2Provider = ({
  observationCreateFormData,
  speciesGroups,
  languages,
  licensesList,

  children
}: ObservationCreate2ProviderProps) => {
  const [showMediaPicker, setShowMediaPicker] = useState<boolean>();

  const { t } = useTranslation();
  const [draftList, setDraftList] = useState<any[]>([]);
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

  const { add, getOneByIndex, getManyByIndex, deleteByID, update } =
    useIndexedDBStore<IDBObservationAsset>(STORE.ASSETS);

  const selectedMediaList = useMemo(
    () => draftList.filter((dr) => selectedHKs.includes(dr.hashKey)),
    [selectedHKs, draftList]
  );

  const refreshDraftMediaFromIdb = async () => {
    const allUnUsedAssets = await getManyByIndex("isUsed", 0);
    const _draftList = allUnUsedAssets.sort((a, b) => b[draftSortBy] - a[draftSortBy]);
    setDraftList(_draftList);
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
    const allUnUsedMedia = await getManyByIndex("isUsed", 0);
    for (const asset of allUnUsedMedia) {
      if (!newMediaHashKeys.includes(asset.hashKey) && asset.status === AssetStatus.Uploaded) {
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
  };

  const uploadPendingMedia = async (pendingMedia, noSave = true) => {
    if (noSave) {
      await updateIdbMediaStatus(pendingMedia.hashKey, AssetStatus.InProgress);
    }

    try {
      const r = await axUploadObservationResource(pendingMedia);
      if (r.success && noSave) {
        await update({
          ...pendingMedia,
          blob: undefined,
          status: AssetStatus.Uploaded
        });
        await updateIdbMediaStatus(pendingMedia.hashKey, AssetStatus.Uploaded);
      }
    } catch (e) {
      console.error(e);
      if (noSave) {
        await updateIdbMediaStatus(pendingMedia.hashKey, AssetStatus.Pending);
      }
    }
  };

  /**
   * Picks all pending media and tries to upload
   *
   */
  const tryMediaSync = async () => {
    const pendingMedia = await getManyByIndex("status", AssetStatus.Pending);
    for (const _media of pendingMedia) {
      await uploadPendingMedia(_media);
    }
    await refreshDraftMediaFromIdb();
  };

  const addToDrafts = async (newMedia, addToObservation) => {
    for (const o of newMedia) {
      await add(o);

      const _odb = await getOneByIndex("hashKey", o.hashKey);
      await uploadPendingMedia(_odb);

      const _draftList = await refreshDraftMediaFromIdb();

      if (addToObservation) {
        setDraftDisabled([...draftDisabled, o.hashKey]);
        emit(OBSERVATION_IMPORT_RESOURCE, [_draftList.find((m) => o.hashKey === m.hashKey)]);
      }
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
    <ObservationCreate2Context.Provider
      value={{
        observationCreateFormData,
        speciesGroups,
        speciesGroupOptions,
        languages,
        licensesList,

        showMediaPicker,
        setShowMediaPicker,

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
          selected: selectedMediaList,
          toggleSelection: toggleDraftSelection
        }
      }}
    >
      <input ref={ref} type="hidden" />
      {children}
    </ObservationCreate2Context.Provider>
  );
};

export default function useObservationCreate2() {
  return useContext(ObservationCreate2Context);
}
