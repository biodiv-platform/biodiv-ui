import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text
} from "@chakra-ui/core";
import FlagActionButton from "@components/@core/action-buttons/flag";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import ObservationStatusBadge from "@components/pages/observation/show/status-badge";
import RecoSuggestion from "@components/pages/observation/show/suggestion/reco-suggestion";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@hooks/useObservationFilter";
import { ObservationData } from "@interfaces/custom";
import { ObservationListPageMapper } from "@interfaces/observation";
import { axFlagObservation, axUnFlagObservation } from "@services/observation.service";
import { formatDateReadable } from "@utils/date";
import { useStoreState } from "easy-peasy";
import React from "react";

interface IInfoTabProps {
  o: ObservationListPageMapper;
  recoUpdated;
  setTabIndex;
}

export default function InfoTab({ o, recoUpdated, setTabIndex }: IInfoTabProps) {
  const { t } = useTranslation();
  const { speciesGroup, observationData, setObservationData } = useObservationFilter();
  const { user } = useStoreState((s) => s);

  const setFlags = (flags) => {
    setObservationData((_draft: ObservationData) => {
      const obIndex = _draft.l.findIndex((ob) => ob.observationId === o.observationId);
      _draft.l[obIndex].flagShow = flags;
    });
  };

  return (
    <Box size="full" display="flex" flexDir="column" justifyContent="space-between">
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
              reco={o.recoShow.recoIbp}
              maxVotedRecoId={o?.recoShow?.recoIbp?.taxonId}
            />
          </Heading>
          <Text mb={1}>{o?.recoShow?.recoIbp?.commonName}</Text>
          <Box color="gray.600">
            <Text className="elipsis" title={o.reverseGeocodedName}>
              <Icon mb={1} mr={2} name="ibplocation" title={t("LIST.LOCATION")} />
              {o.reverseGeocodedName}
            </Text>
            <Text>
              <Icon mb={1} mr={2} name="calendar" title={t("LIST.OBSERVED_ON")} />
              {formatDateReadable(o.observedOn)}
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
            flags={o.flagShow}
            setFlags={setFlags}
            userId={user.id}
            flagFunc={axFlagObservation}
            unFlagFunc={axUnFlagObservation}
          />
        </Flex>
      </SimpleGrid>
      <Box borderTop="1px" borderColor="gray.300">
        <RecoSuggestion
          observationId={o.observationId}
          isLocked={o.recoShow.isLocked}
          recoIbp={o.recoShow.recoIbp}
          allRecoVotes={o.recoShow.allRecoVotes?.slice(0, 1)}
          recoUpdated={recoUpdated}
          permissionOverride={observationData.mvp[o.observationId]}
        />
        <Alert bg="blue.50">
          <AlertIcon />
          {o.recoShow.isLocked
            ? t("OBSERVATION.ID.VALIDATED")
            : o.recoShow.recoIbp
            ? t("OBSERVATION.ID.SUGGEST_NEW_RECO")
            : t("OBSERVATION.ID.NO_SUGGESTION")}
          <Button
            variant="link"
            color="blue.600"
            hidden={o.recoShow.isLocked}
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
