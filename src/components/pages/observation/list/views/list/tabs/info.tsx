import { Alert, Box, Button, Flex, Heading, Separator, SimpleGrid, Text } from "@chakra-ui/react";
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

import CalendarIcon from "@/icons/calendar";
import EditIcon from "@/icons/edit";

interface IInfoTabProps {
  o: ObservationListPageMapper;
  recoUpdated;
  setTab;
}

export default function InfoTab({ o, recoUpdated, setTab }: IInfoTabProps) {
  const { t } = useTranslation();
  const { observationData } = useObservationFilter();
  const { user } = useGlobalState();

  return (
    <Box boxSize="full" display="flex" flexDir="column" justifyContent="space-between">
      <SimpleGrid columns={[1, 1, 3, 3]} px={4} pt={1}>
        <div style={{ gridColumn: "1/3" }}>
          <Heading
            size="xl"
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
                <EditIcon mr={2} mb={1} size={"sm"} />
                {o.observationNotes}
              </Text>
            )}
          </Box>
        </div>
        <Flex justify={[null, null, "flex-end", "flex-end"]} align="top" py={4}>
          <SpeciesGroupBox
            id={o?.speciesGroupId}
            speciesGroups={Object.keys(observationData.ag.groupSpeciesName || {}).map((g) => ({
              label: g.split("|")[1],
              value: Number(g.split("|")[0])
            }))}
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
        <Separator />
        <RecoSuggestion
          observationId={o.observationId}
          isLocked={o.recoShow?.isLocked}
          recoIbp={o.recoShow?.recoIbp}
          allRecoVotes={o.recoShow?.allRecoVotes?.slice(0, 1)}
          recoUpdated={recoUpdated}
          permissionOverride={observationData?.mvp[o.observationId || 0]}
        />
        <Alert.Root alignItems={"center"} bg="blue.50" status={"info"}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              <Text>
                {o.recoShow?.isLocked
                  ? t("observation:id.validated")
                  : o.recoShow?.recoIbp
                  ? t("observation:id.suggest_new_reco")
                  : t("observation:id.no_suggestion")}
              </Text>
            </Alert.Title>
          </Alert.Content>

          {!o.recoShow?.isLocked && (
            <Button
              variant="plain"
              color="blue.600"
              size="sm"
              onClick={() => setTab("observation:id.title")}
              fontWeight={"bold"}
            >
              {t("observation:suggest")}
            </Button>
          )}
        </Alert.Root>
      </Box>
    </Box>
  );
}
