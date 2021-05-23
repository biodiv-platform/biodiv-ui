import { InfoIcon } from "@chakra-ui/icons";
import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import HTMLContainer from "@components/@core/html-container";
import LocalLink from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { ExternalShowData, ShowData, SpeciesGroup } from "@interfaces/observation";
import { axQueryTagsByText, axUpdateObservationTags } from "@services/observation.service";
import { DATE_ACCURACY } from "@static/constants";
import { formatDateReadableFromUTC } from "@utils/date";
import { getInjectableHTML } from "@utils/text";
import React from "react";

import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import SpeciesGroupBox from "./species-group";
import Link from "next/link";

interface IInfoProps {
  observation: ExternalShowData;
  speciesGroups: SpeciesGroup[];
}

export default function Info({ observation: o, speciesGroups }: IInfoProps) {
  const { t } = useTranslation();

  return (
    <Box p={4} mb={4} className="white-box">
      <SimpleGrid columns={[1, 1, 5, 5, 5]} spacing={2}>
        <ResponsiveInfo title="OBSERVATION.NAME">
          <i>{o.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}</i>
          {o.recoIbp?.speciesId && (
            <LocalLink href={`/species/show/${o.recoIbp.speciesId}`}>
              <BlueLink ml={2}>
                <InfoIcon /> {t("OBSERVATION.SPECIES_PAGE")}
              </BlueLink>
            </LocalLink>
          )}
          {o.recoIbp?.commonName && <div>{o.recoIbp.commonName}</div>}
        </ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.GROUP">
          <SpeciesGroupBox
            id={o.observation?.groupId}
            speciesGroups={speciesGroups}
            observationId={o.observation?.id}
          />
        </ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.PLACE">{o.observation?.placeName}</ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.OBSERVED_ON">
          <Stack isInline={true}>
            <Text mr={1}>{formatDateReadableFromUTC(o.observation?.fromDate)}</Text>
            {o.observation?.dateAccuracy === DATE_ACCURACY.ACCURATE && (
              <Tooltip title={t("OBSERVATION.ACCURATE")} shouldWrapChildren={true} hasArrow={true}>
                <CheckIcon color="green.500" />
              </Tooltip>
            )}
          </Stack>
        </ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.CREATED_ON">
          <Stack isInline={true}>
            <Text mr={1}>{formatDateReadableFromUTC(o.observation?.createdOn)}</Text>
          </Stack>
        </ResponsiveInfo>

        <ResponsiveInfo title="Provided by">
          <BlueLink href={o.externalGbifReferenceLink}>
          The Global Biodiversity Information Facility
          </BlueLink>
        </ResponsiveInfo>

        <ResponsiveInfo title="Original source">
          <BlueLink href={o.externalOriginalReferenceLink} >
            {o.externalOriginalReferenceLink}
          </BlueLink>
        </ResponsiveInfo>
      </SimpleGrid>
    </Box>
  );
}
