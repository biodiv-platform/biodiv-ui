import { Avatar, Box, Flex, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react";
import ObservationStatusBadge from "@components/pages/common/status-badge";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import useGlobalState from "@hooks/use-global-state";
import CalendarIcon from "@icons/calendar";
import LocationIcon from "@icons/location";
import { formatDateReadableFromUTC } from "@utils/date";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const InfoView = ({ o, speciesGroup, user }) => {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();

  return (
    <Box className="white-box">
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
                {o?.recoShow?.recoIbp?.scientificName || t("common:unknown")}
              </Text>
              <ObservationStatusBadge
                reco={o.recoShow?.recoIbp}
                crumbs={o.recoShow?.recoIbp?.breadCrumbs}
                taxonId={o.recoShow?.recoIbp?.taxonId}
              />
            </Heading>
            <Text mb={1}>{o?.recoShow?.recoIbp?.commonName}</Text>
            <Box color="gray.600">
              <Text className="elipsis" title={t("observation:list.location")}>
                <LocationIcon mb={1} mr={2} />
                {o.placeName}
              </Text>
              <Text title={t("common:observed_on")}>
                <CalendarIcon mb={1} mr={2} />
                {o?.observedOn ? formatDateReadableFromUTC(o.observedOn) : t("common:unknown")}
              </Text>
            </Box>
          </div>
          <Flex justify={[null, null, "flex-end", "flex-end"]} align="top" py={4}>
            <SpeciesGroupBox
              id={o?.speciesGroupId}
              speciesGroups={speciesGroup}
              observationId={o.observationId}
            />
          </Flex>
        </SimpleGrid>
        <Flex justify={[null, null, "flex-start", "flex-start"]} ml={3} py={2}>
          <Link href={`${currentGroup?.webAddress}/user/show/${user?.id}`}>
            <Flex alignItems="center">
              <Avatar
                mr={1}
                size="sm"
                name={user?.name}
                src={getUserImage(user?.profilePic, user?.name)}
              />
              <Text>{user?.name}</Text>
            </Flex>
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};
export default function InfoTabView({ observationData }) {
  const { speciesGroup } = useObservationFilter();
  const { t } = useTranslation();
  return (
    <Box>
      {observationData?.l ? (
        observationData?.l.map((o) => <InfoView o={o} user={o.user} speciesGroup={speciesGroup} />)
      ) : (
        <Box p={4}>{t("observation:no_custom_field")}</Box>
      )}
    </Box>
  );
}
