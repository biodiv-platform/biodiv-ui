import { Alert, AlertIcon, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useGlobalState from "@hooks/useGlobalState";
import { AssetStatus, IDBObservationAsset, IDBPendingObservation } from "@interfaces/custom";
import useOnlineStatus from "@rehooks/online-status";
import { axUploadObservationResource } from "@services/files.service";
import { axCreateObservation } from "@services/observation.service";
import {
  SYNC_SINGLE_OBSERVATION,
  SYNC_SINGLE_OBSERVATION_DONE,
  SYNC_SINGLE_OBSERVATION_ERROR
} from "@static/events";
import { STORE } from "@static/observation-create";
import { getMyUploadsThumbnail } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { emit, useListener } from "react-gbus";
import { useImmer } from "use-immer";
import { useIndexedDBStore } from "use-indexeddb";

import { useLocalRouter } from "../local-link";
import SyncBox from "./syncbox";

export interface SyncInfo {
  current: number;
  failed: any[];
  successful: any[];
}

export default function OfflineSync() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onOpen, onClose } = useDisclosure(true);
  const [pendingObservations, setPendingObservations] = useState([]);
  const [syncInfo, setSyncInfo] = useImmer<SyncInfo>({
    current: null,
    failed: [],
    successful: []
  });
  const { update, deleteByID: deleteResource } = useIndexedDBStore<IDBObservationAsset>(
    STORE.ASSETS
  );
  const {
    add: addObservation,
    getAll: getAllObservations,
    deleteByID: deleteObservation,
    getByID: getObservation
  } = useIndexedDBStore<IDBPendingObservation>(STORE.PENDING_OBSERVATIONS);

  const { currentGroup, user } = useGlobalState();

  const trySyncSingleObservation = async ({ observation, instant, id = -1 }) => {
    let idbID = id;

    if (instant) {
      try {
        idbID = await addObservation({ data: observation });
      } catch (e) {
        console.error("addObservationIDB", e);
      }
    } else {
      setSyncInfo((_draft) => {
        _draft.current = idbID;
      });
    }

    try {
      for (const resource of observation.resources) {
        await update({ ...resource, isUsed: 1 });
      }
    } catch (e) {
      console.error("updateResourceIDB", e);
    }

    try {
      await Promise.all(
        observation.resources
          .filter((r) => r.status !== AssetStatus.Uploaded)
          .map(axUploadObservationResource)
      );
      const { success, data } = await axCreateObservation({
        ...observation,
        currentGroup
      });
      if (success) {
        await deleteObservation(idbID);
        for (const resource of observation.resources) {
          await deleteResource(resource.id);
        }

        if (instant) {
          notification(t("OBSERVATION.POINTS_GAINED"), NotificationType.Success, {
            points: data?.activityCount
          });
          emit(SYNC_SINGLE_OBSERVATION_DONE);
          router.push(`/observation/show/${data.observation.id}`, true);
        } else {
          setSyncInfo((_draft) => {
            _draft.successful.push(idbID);
          });
        }
      } else {
        emit(SYNC_SINGLE_OBSERVATION_ERROR);
        setSyncInfo((_draft) => {
          _draft.failed.push(idbID);
        });
      }
    } catch (e) {
      emit(SYNC_SINGLE_OBSERVATION_ERROR);
      setSyncInfo((_draft) => {
        _draft.failed.push(idbID);
      });
      console.error(e);
    }
  };

  useListener(trySyncSingleObservation, [SYNC_SINGLE_OBSERVATION]);

  const trySyncPendingObservations = async () => {
    const poList = await getAllObservations();
    setPendingObservations(
      poList.map(({ data, id }) => ({
        data,
        id,
        thumb:
          getMyUploadsThumbnail(data?.resource?.[0].path, user.id) ||
          URL.createObjectURL(data?.resources?.[0]?.blob)
      }))
    );
    const poIds = poList.map((o) => o.id);

    onOpen();

    for (const poId of poIds) {
      const po = await getObservation(poId);
      if (po) {
        trySyncSingleObservation({
          observation: po.data,
          instant: false,
          id: po?.id
        });
      }
    }

    setSyncInfo((_draft) => {
      _draft.current = null;
    });
  };

  useEffect(() => {
    if (isOnline && document.hasFocus()) {
      trySyncPendingObservations();
    }
  }, [isOnline]);

  const handleOnDeleteObservation = (poId) => {
    deleteObservation(poId);
    setPendingObservations(pendingObservations.filter(({ id }) => id !== poId));
  };

  return (
    <div>
      {isOpen && pendingObservations.length > 0 && (
        <SyncBox
          syncInfo={syncInfo}
          pendingObservations={pendingObservations}
          deleteObservation={handleOnDeleteObservation}
          onClose={onClose}
        />
      )}
      {!isOnline && (
        <Alert status="error" variant="solid" display="flex" justifyContent="center">
          <AlertIcon />
          {t("OFFLINE")}
        </Alert>
      )}
    </div>
  );
}
