import { Alert, AlertIcon, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { AssetStatus, IDBObservationAsset, IDBPendingObservation } from "@interfaces/custom";
import useOnlineStatus from "@rehooks/online-status";
import { axUploadResource } from "@services/files.service";
import { axCreateObservation } from "@services/observation.service";
import {
  SYNC_SINGLE_OBSERVATION,
  SYNC_SINGLE_OBSERVATION_DONE,
  SYNC_SINGLE_OBSERVATION_ERROR,
  SYNC_SINGLE_GROUP,
  SYNC_SINGLE_GROUP_DONE,
  SYNC_SINGLE_GROUP_ERROR
} from "@static/events";
import { axCreateGroup } from "@services/usergroup.service";
import { STORE } from "@static/observation-create";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { emit, useListener } from "react-gbus";
import { useIndexedDBStore } from "use-indexeddb";

import { useLocalRouter } from "../local-link";
import SyncBox from "./syncbox";

export interface SyncInfo {
  total?: number;
  current?: number;
}

export default function OfflineSync() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onOpen, onClose } = useDisclosure(true);
  const [syncInfo, setSyncInfo] = useState<SyncInfo>();
  const { getAll: getAllGroups, add: addGroups, deleteByID: deleteGroups } = useIndexedDBStore<
    IDBPendingObservation
  >(STORE.PENDING_GROUPS);
  const { update, deleteByID: deleteResource } = useIndexedDBStore<IDBObservationAsset>(
    STORE.ASSETS
  );
  const {
    add: addObservation,
    getAll: getAllObservations,
    deleteByID: deleteObservation
  } = useIndexedDBStore<IDBPendingObservation>(STORE.PENDING_OBSERVATIONS);

  const trySyncSingleObservation = async ({ observation, instant, id = -1 }) => {
    let idbID = id;

    if (instant) {
      try {
        idbID = await addObservation({ data: observation });
      } catch (e) {
        console.error("addObservationIDB", e);
      }
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
        observation.resources.filter((r) => r.status !== AssetStatus.Uploaded).map(axUploadResource)
      );
      const { success, data } = await axCreateObservation(observation);
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
        }
      } else {
        emit(SYNC_SINGLE_OBSERVATION_ERROR);
      }
    } catch (e) {
      emit(SYNC_SINGLE_OBSERVATION_ERROR);
      console.error(e);
    }
  };
  const trySyncingGroup = async ({ group, instant, id = -1 }) => {
    let idbID = id;
    if (instant) {
      try {
        idbID = await addGroups({ data: group });
      } catch (e) {
        console.error("addGroup error", e);
      }
    }
    try {
      const { success } = await axCreateGroup(group);
      if (success) {
        await deleteGroups(idbID);
        if (instant) {
          emit(SYNC_SINGLE_GROUP_DONE);
          router.push(`/`, true);
        }
      } else {
        emit(SYNC_SINGLE_GROUP_DONE);
      }
    } catch (e) {
      emit(SYNC_SINGLE_GROUP_ERROR);
      console.error(e);
    }
  };

  useListener(trySyncSingleObservation, [SYNC_SINGLE_OBSERVATION]);
  useListener(trySyncingGroup, [SYNC_SINGLE_GROUP]);

  const trySyncPendingObservations = async () => {
    const pendingObservations = await getAllObservations();
    const total = pendingObservations.length;
    setSyncInfo({ total, current: 0 });
    onOpen();
    await Promise.all(
      pendingObservations.map(async (observation, current) => {
        setSyncInfo({ total, current: current + 1 });
        await trySyncSingleObservation({
          observation: observation.data,
          instant: false,
          id: observation.id
        });
      })
    );
    onClose();
  };
  const trySyncPendingGroups = async () => {
    const pendingGroup = await getAllGroups();
    const total = pendingGroup.length;
    setSyncInfo({ total, current: 0 });
    onOpen();
    await Promise.all(
      pendingGroup.map(async (group, current) => {
        setSyncInfo({ total, current: current + 1 });
        await trySyncingGroup({
          group: group.data,
          instant: false,
          id: group.id
        });
      })
    );
    onClose();
  };
  useEffect(() => {
    if (isOnline && document.hasFocus()) {
      trySyncPendingObservations();
      trySyncPendingGroups();
    }
  }, [isOnline]);

  return (
    <div>
      {isOpen && syncInfo && <SyncBox syncInfo={syncInfo} onClose={onClose} />}
      {!isOnline && (
        <Alert status="error" variant="solid" display="flex" justifyContent="center">
          <AlertIcon />
          {t("OFFLINE")}
        </Alert>
      )}
    </div>
  );
}
