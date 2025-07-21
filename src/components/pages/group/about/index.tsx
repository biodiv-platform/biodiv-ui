import { Badge, Box, Flex, Heading } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import HomeDescription from "@components/pages/home/description";
import useTranslation from "next-translate/useTranslation";
import React from "react";

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
}

export default function AboutGroupComponent({
  speciesGroups,
  habitats,
  groupInfo,
  founders,
  moderators,
  customFieldList,
  groupRules
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
              {"Taxonomic Rule"}
            </Heading>
            {groupRules.taxonomicRuleList.map((item, idx) => {
              return (
                <Box key={idx} fontSize={"sm"} color={"gray.600"} mb={2}>
                  {item.name}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </div>
  );
}
