import { Badge, Button, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import React from "react";

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

export default function SyncRow({ syncInfo, pendingObservation, deleteObservation }) {
  const { t } = useTranslation();
  const { data, thumb, id } = pendingObservation;

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
      <img src={thumb} />
      <div>
        <Text lineHeight="1rem" mb={1}>
          {title}
          {isUploading && <Badge variantColor="orange">{t("OBSERVATION.SYNC.UPLOADING")}</Badge>}
          {isDone && <Badge variantColor="green">{t("OBSERVATION.SYNC.DONE")}</Badge>}
          {isFailed && <Badge variantColor="red">{t("OBSERVATION.SYNC.FAILED")}</Badge>}
        </Text>
        <small>{data?.reverseGeocoded}</small>
        <Button
          variantColor="red"
          isDisabled={isDone || isUploading}
          size="xs"
          onClick={handleOnDelte}
        >
          {t("DELETE")}
        </Button>
      </div>
    </PendingObservationBox>
  );
}
