import { CalendarIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Box, Button, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import FlagActionButton from "@components/@core/action-buttons/flag";
import ObservationStatusBadge from "@components/pages/common/status-badge";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import RecoSuggestion from "@components/pages/observation/show/suggestion/reco-suggestion";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import LocationIcon from "@icons/location";
import { ObservationListPageMapper } from "@interfaces/observation";
import { axFlagObservation, axUnFlagObservation } from "@services/observation.service";
import { formatDateReadableFromUTC } from "@utils/date";
import React from "react";

interface IInfoTabProps {
  o: ObservationListPageMapper;
  recoUpdated;
  setTabIndex;
}

export default function InfoTab({ o, recoUpdated, setTabIndex }: IInfoTabProps) {
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
            title={o?.recoShow?.recoIbp?.scientificName}
          >
            <Text as="i" mr={2}>
              {o?.recoShow?.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}
            </Text>
            <ObservationStatusBadge
              reco={o.recoShow?.recoIbp}
              crumbs={o.recoShow?.recoIbp?.breadCrumbs}
              taxonId={o.recoShow?.recoIbp?.taxonId}
            />
          </Heading>
          <Text mb={1}>{o?.recoShow?.recoIbp?.commonName}</Text>
          <Box color="gray.600">
            <Text className="elipsis" title={t("LIST.LOCATION")}>
              <LocationIcon mb={1} mr={2} />
              {o.reverseGeocodedName}
            </Text>
            <Text title={t("LIST.OBSERVED_ON")}>
              <CalendarIcon mb={1} mr={2} />
              {formatDateReadableFromUTC(o.observedOn)}
            </Text>
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
      <Box borderTop="1px" borderColor="gray.300">
        <RecoSuggestion
          observationId={o.observationId}
          isLocked={o.recoShow?.isLocked}
          recoIbp={o.recoShow?.recoIbp}
          allRecoVotes={o.recoShow?.allRecoVotes?.slice(0, 1)}
          recoUpdated={recoUpdated}
          permissionOverride={observationData?.mvp[o.observationId || 0]}
        />
        <Alert bg="blue.50">
          <AlertIcon />
          {o.recoShow?.isLocked
            ? t("OBSERVATION.ID.VALIDATED")
            : o.recoShow?.recoIbp
            ? t("OBSERVATION.ID.SUGGEST_NEW_RECO")
            : t("OBSERVATION.ID.NO_SUGGESTION")}
          <Button
            variant="link"
            color="blue.600"
            hidden={o.recoShow?.isLocked}
            m="auto"
            mr={0}
            onClick={() => setTabIndex(1)}
          >
            {t("OBSERVATION.SUGGEST")}
          </Button>
        </Alert>
      </Box>
    </Box>
  );
}
