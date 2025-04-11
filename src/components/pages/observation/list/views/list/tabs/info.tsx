import { Box, Button, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import FlagActionButton from "@components/@core/action-buttons/flag";
import ScientificName from "@components/@core/scientific-name";
import ObservationStatusBadge from "@components/pages/common/status-badge";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import RecoSuggestion from "@components/pages/observation/show/suggestion/reco-suggestion";
import useGlobalState from "@hooks/use-global-state";
import LocationIcon from "@icons/location";
import { ObservationListPageMapper } from "@interfaces/observation";
import { axFlagObservation, axUnFlagObservation } from "@services/observation.service";
import { formatDateReadableFromUTC } from "@utils/date";
import { stripTags } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Alert } from "@/components/ui/alert";
import CalendarIcon from "@/icons/calendar";
import EditIcon from "@/icons/edit";

interface IInfoTabProps {
  o: ObservationListPageMapper;
  recoUpdated;
  setTab;
}

export default function InfoTab({ o, recoUpdated, setTab }: IInfoTabProps) {
  const { t } = useTranslation();
  const { speciesGroup, observationData } = useObservationFilter();
  const { user } = useGlobalState();

  return (
    <Box boxSize="full" display="flex" flexDir="column" justifyContent="space-between">
      <SimpleGrid columns={[1, 1, 3, 3]} px={4} pt={1}>
        <div style={{ gridColumn: "1/3" }}>
          <Heading
            size="md"
            pt={2}
            mb={1}
            className="elipsis-2"
            title={stripTags(o?.recoShow?.recoIbp?.scientificName)}
          >
            <Box mr={2}>
              <ScientificName value={o?.recoShow?.recoIbp?.scientificName || t("common:unknown")} />
            </Box>
            <ObservationStatusBadge
              reco={o.recoShow?.recoIbp}
              crumbs={o.recoShow?.recoIbp?.breadCrumbs}
              taxonId={o.recoShow?.recoIbp?.taxonId}
            />
          </Heading>
          <Text mb={1}>{o?.recoShow?.recoIbp?.commonName}</Text>
          <Box color="gray.600">
            <Text className="elipsis" title={t("observation:list.location")}>
              <LocationIcon mb={1} mr={2} size={"sm"} />
              {o.placeName}
            </Text>
            <Text title={t("common:observed_on")}>
              <CalendarIcon mb={1} mr={2} size={"sm"} />
              {o?.observedOn ? formatDateReadableFromUTC(o.observedOn) : t("common:unknown")}
            </Text>

            {o?.observationNotes && (
              <Text className="elipsis" title={t("observation:notes")}>
                <EditIcon mr={2} mb={1} />
                {o.observationNotes}
              </Text>
            )}
          </Box>
        </div>
        <Flex justify={[null, null, "flex-end", "flex-end"]} align="top" py={4}>
          <SpeciesGroupBox
            id={o?.speciesGroupId}
            speciesGroups={speciesGroup}
            observationId={o.observationId}
          />
          <FlagActionButton
            resourceId={o.observationId}
            initialFlags={o.flagShow}
            userId={user?.id}
            flagFunc={axFlagObservation}
            unFlagFunc={axUnFlagObservation}
          />
        </Flex>
      </SimpleGrid>
      <Box borderTop="1px" borderColor="gray.300" width={"full"}>
        <RecoSuggestion
          observationId={o.observationId}
          isLocked={o.recoShow?.isLocked}
          recoIbp={o.recoShow?.recoIbp}
          allRecoVotes={o.recoShow?.allRecoVotes?.slice(0, 1)}
          recoUpdated={recoUpdated}
          permissionOverride={observationData?.mvp[o.observationId || 0]}
        />
        <Alert bg="blue.50">
          {o.recoShow?.isLocked
            ? t("observation:id.validated")
            : o.recoShow?.recoIbp
            ? t("observation:id.suggest_new_reco")
            : t("observation:id.no_suggestion")}
          <Button
            variant="plain"
            color="blue.600"
            hidden={o.recoShow?.isLocked}
            m="auto"
            mr={0}
            onClick={() => setTab("observation:id.title")}
          >
            {t("observation:suggest")}
          </Button>
        </Alert>
      </Box>
    </Box>
  );
}
