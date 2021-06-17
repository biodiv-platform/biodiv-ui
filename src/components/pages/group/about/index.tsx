import { Badge, Flex } from "@chakra-ui/react";
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
}

export default function AboutGroupComponent({
  speciesGroups,
  habitats,
  groupInfo,
  founders,
  moderators
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
        <Badge colorScheme={allowUserToJoin ? "blue" : "yellow"}>
          {t(allowUserToJoin ? "GROUP.ABOUT.OPEN_GROUP" : "GROUP.ABOUT.CLOSED_GROUP")}
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
    </div>
  );
}
