import { Badge, Button, Image, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import React, { useMemo } from "react";

import ExternalBlueLink from "../blue-link/external";
import { SyncInfo } from "./offline-sync";

const PendingObservationBox = styled.div`
  border-top: 1px solid var(--gray-200);
  padding: 1rem;
  display: flex;
  img {
    border-radius: 0.25rem;
    margin-right: 1rem;
    height: 46px;
    width: 46px;
    object-fit: cover;
  }
  small {
    display: block;
    margin-bottom: 0.25rem;
  }
`;

interface SyncRowProps {
  syncInfo: SyncInfo;
  pendingObservation;
  deleteObservation;
}

export default function SyncRow({ syncInfo, pendingObservation, deleteObservation }: SyncRowProps) {
  const { t } = useTranslation();
  const { data, id } = pendingObservation;
  const thumb = useMemo(
    () =>
      data?.resources?.[0]?.blob ? window.URL.createObjectURL(data?.resources?.[0]?.blob) : null,
    []
  );

  const title = `${
    data?.recoData?.taxonCommonName ||
    data?.recoData.taxonScientificName ||
    t("OBSERVATION.UNKNOWN")
  } `;

  const isDone = syncInfo.successful.includes(id);
  const isFailed = syncInfo.failed.includes(id);
  const isUploading = !isDone && !isFailed && syncInfo.current === id;

  const handleOnDelte = () => deleteObservation(id);

  return (
    <PendingObservationBox>
      <Image bg="gray.200" src={thumb} />
      <div>
        <Text lineHeight="1rem" mb={1}>
          {title}
          {isUploading && <Badge colorScheme="orange">{t("OBSERVATION.SYNC.UPLOADING")}</Badge>}
          {isDone && <Badge colorScheme="green">{t("OBSERVATION.SYNC.DONE")}</Badge>}
          {isFailed && <Badge colorScheme="red">{t("OBSERVATION.SYNC.FAILED")}</Badge>}
        </Text>
        <small>{data?.reverseGeocoded}</small>
        <Button
          colorScheme="red"
          mr={2}
          isDisabled={isDone || isUploading}
          size="xs"
          onClick={handleOnDelte}
        >
          {t("DELETE")}
        </Button>
        {isDone && (
          <Button
            as={ExternalBlueLink}
            colorScheme="blue"
            size="xs"
            // @ts-ignore
            href={`/observation/show/${syncInfo.successMap[id]}`}
          >
            View
          </Button>
        )}
      </div>
    </PendingObservationBox>
  );
}
