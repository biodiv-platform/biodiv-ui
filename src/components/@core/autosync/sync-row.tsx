import { Badge, Button, Image, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import { SyncInfo } from "./offline-sync";

const PendingObservationBox = styled.div`
  border-top: 1px solid var(--chakra-colors-gray-200);
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
  const thumb = useMemo(() => {
    try {
      return window.URL.createObjectURL(data?.resources?.[0]?.blob);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  const title = `${
    data?.recoData?.taxonCommonName || data?.recoData.taxonScientificName || t("common:unknown")
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
          {isUploading && <Badge colorPalette="orange">{t("observation:sync.uploading")}</Badge>}
          {isDone && <Badge colorPalette="green">{t("observation:sync.done")}</Badge>}
          {isFailed && <Badge colorPalette="red">{t("observation:sync.failed")}</Badge>}
        </Text>
        <small>{data?.reverseGeocoded}</small>
        <Button
          colorPalette="red"
          mr={2}
          disabled={isDone || isUploading}
          size="xs"
          onClick={handleOnDelte}
        >
          {t("common:delete")}
        </Button>
        {isDone && (
          <Button asChild colorPalette="blue" size="xs">
            <a href={`/observation/show/${syncInfo.successMap[id]}`}>View</a>
          </Button>
        )}
      </div>
    </PendingObservationBox>
  );
}
