import { Heading, Spinner, Text } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import CheckIcon from "@icons/check";
import { SYNC_SINGLE_OBSERVATION_DONE, SYNC_SINGLE_OBSERVATION_ERROR } from "@static/events";
import React, { useState } from "react";
import { useListener } from "react-gbus";

import Saving from "./saving";

const ProcessingBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  margin-top: 3rem;
  .illustration {
    width: 500px;
    max-width: 90%;
    height: auto;
  }
`;

enum ObservationStatus {
  InProgress,
  Done,
  Error
}

export default function SavingObservation() {
  const [status, setStatus] = useState(ObservationStatus.InProgress);
  const { t } = useTranslation();

  useListener(() => setStatus(ObservationStatus.Done), [SYNC_SINGLE_OBSERVATION_DONE]);

  useListener(() => setStatus(ObservationStatus.Error), [SYNC_SINGLE_OBSERVATION_ERROR]);

  return (
    <ProcessingBox className="fadeInUp">
      <Saving />
      {status === ObservationStatus.Done && (
        <>
          <CheckIcon className="fadeInUp" mt={6} fontSize="3rem" color="green.500" />
          <Heading className="fadeInUp delay-1" my={4}>
            {t("OBSERVATION.SUCCESS")}
          </Heading>
          <BlueLink href="./create" mb={6}>
            {t("OBSERVATION.CONTINUE")}
          </BlueLink>
        </>
      )}
      {status === ObservationStatus.InProgress && (
        <>
          <Spinner className="fadeInUp delay-2" mt={8} />
          <Heading className="fadeInUp delay-3" my={4}>
            {t("ONE_MOMENT_PLEASE")}
          </Heading>
          <Text mb={6} className="fadeInUp delay-4">
            {t("OBSERVATION.CREATING")}
          </Text>
        </>
      )}
      {status === ObservationStatus.Error && (
        <>
          <Heading className="fadeInUp delay-3" mt={8} mb={4}>
            {t("OBSERVATION.SAVED")}
          </Heading>
          <Text mb={4} maxW="35rem" className="fadeInUp delay-4">
            {t("OBSERVATION.SAVED_MESSAGE")}
          </Text>
          <LocalLink href="/observation/recreate" prefixGroup={true}>
            <BlueLink mb={6}>{t("OBSERVATION.CONTINUE")}</BlueLink>
          </LocalLink>
        </>
      )}
    </ProcessingBox>
  );
}
