import { Badge, Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import HomeDescription from "@components/pages/home/description";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { parse } from "wkt";

import GeoJSONPreview from "@/components/@core/map-preview/geojson";
import { TAXON_BADGE_COLORS } from "@/static/constants";
import { formatDateFromUTC } from "@/utils/date";

import UserAvatarList from "../common/user-image-list";
import FilterIconsList from "./filter-icon-list";
import MapDrawView from "./map-draw-view";

interface GroupEditPageProps {
  speciesGroups;
  habitats;
  customFieldList;
  allCustomField;
  groupInfo: {
    description;
    name;
    allowUserToJoin;
    speciesGroupIds;
    habitatIds;
    neLongitude;
    neLatitude;
    swLatitude;
    swLongitude;
  };
  founders;
  moderators;
  groupRules;
  traits;
}

export default function AboutGroupComponent({
  speciesGroups,
  habitats,
  groupInfo,
  founders,
  moderators,
  customFieldList,
  groupRules,
  traits
}: GroupEditPageProps) {
  const { t } = useTranslation();
  const {
    description,
    name,
    allowUserToJoin,
    speciesGroupIds,
    habitatIds,
    neLongitude,
    neLatitude,
    swLatitude,
    swLongitude
  } = groupInfo;

  return (
    <div className="container mt">
      <Flex alignItems="center" mb={6}>
        <PageHeading mb={0} mr={4}>
          👥 {t("group:about.title")} {name}
        </PageHeading>
        <Badge colorPalette={allowUserToJoin ? "blue" : "yellow"}>
          {t(allowUserToJoin ? t("group:about.open_group") : t("group:about.closed_group"))}
        </Badge>
      </Flex>
      <HomeDescription description={description} mb={6} />
      <FilterIconsList
        title={t("common:species_coverage")}
        type="species"
        filterIds={speciesGroupIds}
        filterList={speciesGroups}
      />
      <FilterIconsList
        title={t("common:habitats_covered")}
        type="habitat"
        filterIds={habitatIds}
        filterList={habitats}
      />
      <MapDrawView
        title={t("group:spatial_coverge")}
        neLongitude={neLongitude}
        neLatitude={neLatitude}
        swLatitude={swLatitude}
        swLongitude={swLongitude}
      />
      <UserAvatarList title={t("group:admin.founder")} userList={founders} />
      <UserAvatarList title={t("group:admin.moderator")} userList={moderators} />
      {customFieldList.length > 0 && (
        <Box mb={6}>
          <Heading size="lg" as="h2" mb={4}>
            {t("group:custom_field.title")}
          </Heading>
          {customFieldList.map((item) => (
            <Box fontSize={"md"} color={"gray.600"}>
              <Flex alignItems="center">
                <Box mr={4}>{item.customFields.name}</Box>
                <Badge colorScheme="blue">{item.customFields.dataType}</Badge>
              </Flex>
            </Box>
          ))}
        </Box>
      )}
      <Box mb={6}>
        <Heading size="lg" as="h2" mb={4}>
          {t("group:rules.title")}
        </Heading>
        <Heading size="md" as="h2" mb={2}>
          {"User Rule"}
        </Heading>
        {groupRules.hasUserRule ? (
          <Box fontSize={"sm"} color={"gray.600"} mb={2}>
            {"Only member’s content will be posted"}
          </Box>
        ) : (
          <Box fontSize={"sm"} color={"gray.600"} mb={2}>
            {"Any user’s content will be posted"}
          </Box>
        )}

        {groupRules.hasTaxonomicRule && (
          <Box>
            <Heading size="md" as="h2" mb={2}>
              Taxonomic Rule
            </Heading>
            <Box fontSize="sm">
              {groupRules.taxonomicRuleList.map((item, idx) => (
                <Box
                  key={idx}
                  display="inline-block"
                  px={2}
                  py={1}
                  mr={2}
                  mb={2}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                >
                  {item.name}
                  <Stack direction={"row"} mt={1} gap={2}>
                    {item.status && (
                      <Badge colorPalette={TAXON_BADGE_COLORS[item.status]}>{item.status}</Badge>
                    )}
                    {item.position && (
                      <Badge colorPalette={TAXON_BADGE_COLORS[item.position]}>
                        {item.position}
                      </Badge>
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {groupRules.hasObservedOnDateRule && (
          <Box>
            <Heading size="md" as="h2" mb={2}>
              Observed On Date Rule
            </Heading>
            {groupRules.observedOnDateRule.map((item) => (
              <Box fontSize={"sm"} color={"gray.600"} mb={2}>
                {`${formatDateFromUTC(item.fromDate)} to ${formatDateFromUTC(item.toDate)}`}
              </Box>
            ))}
          </Box>
        )}
        {groupRules.hasCreatedOnDateRule && (
          <Box>
            <Heading size="md" as="h2" mb={2}>
              Created On Date Rule
            </Heading>
            {groupRules.createdOnDateRuleList.map((item) => (
              <Box fontSize={"sm"} color={"gray.600"} mb={2}>
                {`${formatDateFromUTC(item.fromDate)} to ${formatDateFromUTC(item.toDate)}`}
              </Box>
            ))}
          </Box>
        )}
        {groupRules.hasSpatialRule && (
          <Box>
            <Heading size="md" as="h2" mb={2}>
              Spatial Rule
            </Heading>
            <GeoJSONPreview
              data={{
                type: "Feature",
                properties: {},
                geometry:parse(groupRules.spartialRuleList[0].spatialData)
              }}
            />
          </Box>
        )}
        {groupRules.hasTraitRule && (
          <Box>
            <Heading size="md" as="h2" mb={2}>
              Trait Rule
            </Heading>
            {groupRules.traitRuleList.map((item) => {
              const trait = traits.filter((trait) => trait.traits.traitId === item.traitId)[0];
              return (
                <Box fontSize={"sm"} color={"gray.600"} mb={2}>
                  {trait.traits.name}:
                  {trait.values.filter((v) => v.traitValueId === item.value)[0].value}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </div>
  );
}
