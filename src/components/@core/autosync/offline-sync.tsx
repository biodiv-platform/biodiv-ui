import { Alert, AlertIcon, useDisclosure } from "@chakra-ui/react";
import useGlobalState from "@hooks/use-global-state";
import { AssetStatus, IDBObservationAsset, IDBPendingObservation } from "@interfaces/custom";
import useOnlineStatus from "@rehooks/online-status";
import { axUploadObservationResource } from "@services/files.service";
import { axCreateObservation } from "@services/observation.service";
import {
  SYNC_OBSERVATION,
  SYNC_SINGLE_OBSERVATION_DONE,
  SYNC_SINGLE_OBSERVATION_ERROR
} from "@static/events";
import { STORE } from "@static/observation-create";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { emit, useListener } from "react-gbus";
import { useImmer } from "use-immer";
import { useIndexedDBStore } from "use-indexeddb";

import { useLocalRouter } from "../local-link";
import SyncBox from "./syncbox";

export interface SyncInfo {
  current: number | null;
  failed: any[];
  successful: any[];
  successMap: Record<string, unknown>;
}

interface SyncSingleObservationProps {
  id?;
  instant;
  observation;
  redirect?;
}

export default function OfflineSync() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [pendingObservations, setPendingObservations] = useState<any[]>([]);
  const [syncInfo, setSyncInfo] = useImmer<SyncInfo>({
    current: null,
    failed: [],
    successful: [],
    successMap: {}
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

  const { currentGroup } = useGlobalState();

  const trySyncSingleObservation = async ({
    observation,
    instant,
    id = -1,
    redirect = true
  }: SyncSingleObservationProps) => {
    let idbID = id;

    if (instant) {
      try {
        idbID = await addObservation({ data: observation } as any);
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
          notification(
            t("observation:points_gained", {
              points: data?.activityCount
            }),
            NotificationType.Success
          );
          emit(SYNC_SINGLE_OBSERVATION_DONE, { observation, data });
          if (redirect) {
            router.push(`/observation/show/${data.observation.id}`, true);
          }
        } else {
          setSyncInfo((_draft) => {
            _draft.successMap[idbID] = data.observation.id;
            _draft.successful.push(idbID);
          });
        }
      } else {
        emit(SYNC_SINGLE_OBSERVATION_ERROR, { observation });
        setSyncInfo((_draft) => {
          _draft.failed.push(idbID);
        });
      }
    } catch (e) {
      emit(SYNC_SINGLE_OBSERVATION_ERROR, { observation });
      setSyncInfo((_draft) => {
        _draft.failed.push(idbID);
      });
      console.error(e);
    }
  };

  const trySyncincObservations = async (observations) => {
    for (const observation of observations) {
      await trySyncSingleObservation(observation);
    }
  };

  useListener(trySyncincObservations, [SYNC_OBSERVATION]);

  const trySyncPendingObservations = async () => {
    const poList = await getAllObservations();
    setPendingObservations(poList);
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
          {t("common:offline")}
        </Alert>
      )}
    </div>
  );
}
