import { InfoIcon } from "@chakra-ui/icons";
import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import HTMLContainer from "@components/@core/html-container";
import LocalLink from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import CheckIcon from "@icons/check";
import { ShowData, SpeciesGroup } from "@interfaces/observation";
import { axQueryTagsByText, axUpdateObservationTags } from "@services/observation.service";
import { DATE_ACCURACY } from "@static/constants";
import { formatDateReadableFromUTC } from "@utils/date";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
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

  return (
    <Box p={4} mb={4} className="white-box">
      <SimpleGrid columns={[1, 1, 5, 5]} spacing={2}>
        <ResponsiveInfo title="common:name">
          <i>{o.recoIbp?.scientificName || t("common:unknown")}</i>
          {o.recoIbp?.speciesId && (
            <LocalLink href={`/species/show/${o.recoIbp.speciesId}`}>
              <BlueLink ml={2}>
                <InfoIcon /> {t("observation:species_page")}
              </BlueLink>
            </LocalLink>
          )}
          {o.recoIbp?.commonName && <div>{o.recoIbp.commonName}</div>}
        </ResponsiveInfo>

        <ResponsiveInfo title="observation:group">
          <SpeciesGroupBox
            id={o.observation?.groupId}
            speciesGroups={speciesGroups}
            observationId={o.observation?.id}
          />
        </ResponsiveInfo>

        <ResponsiveInfo title="form:place">{o.observation?.placeName}</ResponsiveInfo>

        <ResponsiveInfo title="common:observed_on">
          <Stack isInline={true}>
            <Text mr={1}>
              {o.observation?.fromDate
                ? formatDateReadableFromUTC(o.observation?.fromDate)
                : t("common:unknown")}
            </Text>
            {o.observation?.dateAccuracy === DATE_ACCURACY.ACCURATE && (
              <Tooltip title={t("observation:accurate")} shouldWrapChildren={true} hasArrow={true}>
                <CheckIcon color="green.500" />
              </Tooltip>
            )}
          </Stack>
        </ResponsiveInfo>

        <ResponsiveInfo title="observation:created_on">
          <Stack isInline={true}>
            <Text mr={1}>{formatDateReadableFromUTC(o.observation?.createdOn)}</Text>
          </Stack>
        </ResponsiveInfo>

        {o.observation?.notes && (
          <ResponsiveInfo title="observation:notes">
            <Box
              as={HTMLContainer}
              gridColumn="2/5"
              dangerouslySetInnerHTML={{
                __html: getInjectableHTML(o?.observation?.notes)
              }}
            ></Box>
          </ResponsiveInfo>
        )}

        <ResponsiveInfo title="form:tags">
          <Tags
            items={o.tags}
            objectId={o.observation?.id}
            queryFunc={axQueryTagsByText}
            updateFunc={axUpdateObservationTags}
          />
        </ResponsiveInfo>
      </SimpleGrid>
    </Box>
  );
}
