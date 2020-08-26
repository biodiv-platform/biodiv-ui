import { Box, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "@configs/i18n/useTranslation";
import useGlobalState from "@hooks/useGlobalState";
import { ShowData, SpeciesGroup } from "@interfaces/observation";
import { axQueryDocumentTagsByText } from "@services/document.service";
import { axUpdateObservationTags } from "@services/observation.service";
import { DATE_ACCURACY } from "@static/constants";
import { formatDateReadable } from "@utils/date";
import { getInjectableHTML } from "@utils/text";
import React from "react";

import { ResponsiveInfo } from "./responsive-info";
import SpeciesGroupBox from "./species-group";
import Tags from "./tags";

interface IInfoProps {
  observation: ShowData;
  speciesGroups: SpeciesGroup[];
}

export default function Info({ observation: o, speciesGroups }: IInfoProps) {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();

  const observedOn = formatDateReadable(o.observation.fromDate);
  const createdOn = formatDateReadable(o.observation.createdOn);

  return (
    <Box p={4} mb={4} className="white-box">
      <SimpleGrid columns={[1, 1, 5, 5]} spacing={2}>
        <ResponsiveInfo title="OBSERVATION.NAME">
          <i>{o.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}</i>
          {o.recoIbp?.speciesId && (
            <LocalLink href={`${currentGroup?.webAddress}/species/show/${o.recoIbp.speciesId}`}>
              <BlueLink ml={2}>
                <Icon name="info" /> {t("OBSERVATION.SPECIES_PAGE")}
              </BlueLink>
            </LocalLink>
          )}
          {o.recoIbp?.commonName && <div>{o.recoIbp.commonName}</div>}
        </ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.GROUP">
          <SpeciesGroupBox
            id={o.observation.groupId}
            speciesGroups={speciesGroups}
            observationId={o.observation.id}
          />
        </ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.PLACE">{o.observation.placeName}</ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.OBSERVED_ON">
          <Stack isInline={true}>
            <Text mr={1}>{observedOn}</Text>
            {o.observation.dateAccuracy === DATE_ACCURACY.ACCURATE && (
              <Tooltip title={t("OBSERVATION.ACCURATE")} shouldWrapChildren={true} hasArrow={true}>
                <Icon color="green.500" name="ibpcheck" />
              </Tooltip>
            )}
          </Stack>
        </ResponsiveInfo>

        <ResponsiveInfo title="OBSERVATION.CREATED_ON">
          <Stack isInline={true}>
            <Text mr={1}>{createdOn}</Text>
          </Stack>
        </ResponsiveInfo>

        {o.observation?.notes && (
          <ResponsiveInfo title="OBSERVATION.NOTES">
            <Box
              gridColumn="2/5"
              className="sanitized-html"
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(o?.observation?.notes)
              }}
            ></Box>
          </ResponsiveInfo>
        )}

        <ResponsiveInfo title="OBSERVATION.TAGS">
          <Tags
            items={o.tags}
            objectId={o.observation.id}
            queryFunc={axQueryDocumentTagsByText}
            updateFunc={axUpdateObservationTags}
          />
        </ResponsiveInfo>
      </SimpleGrid>
    </Box>
  );
}
