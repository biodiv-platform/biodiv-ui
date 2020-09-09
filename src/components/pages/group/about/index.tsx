import { Badge, Flex } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import HomeDescription from "@components/pages/home/description";
import useTranslation from "@configs/i18n/useTranslation";
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
    speciesGroupId;
    habitatId;
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
    speciesGroupId,
    habitatId,
    neLongitude,
    neLatitude,
    swLatitude,
    swLongitude
  } = groupInfo;

  return (
    <div className="container mt">
      <Flex alignItems="center" mb={6}>
        <PageHeading mb={0} mr={4}>
          👥 {t("GROUP.ABOUT.TITLE")} {name}
        </PageHeading>
        <Badge variantColor={allowUserToJoin ? "blue" : "yellow"}>
          {t(allowUserToJoin ? "GROUP.ABOUT.OPEN_GROUP" : "GROUP.ABOUT.CLOSED_GROUP")}
        </Badge>
      </Flex>
      <HomeDescription description={description} mb={6} />
      <FilterIconsList
        title={t("GROUP.SPECIES_COVERAGE")}
        type="species"
        filterIds={speciesGroupId}
        filterList={speciesGroups}
      />
      <FilterIconsList
        title={t("GROUP.HABITATS_COVERED")}
        type="habitat"
        filterIds={habitatId}
        filterList={habitats}
      />
      <MapDrawView
        title={t("GROUP.SPATIAL_COVERGE")}
        neLongitude={neLongitude}
        neLatitude={neLatitude}
        swLatitude={swLatitude}
        swLongitude={swLongitude}
      />
      <UserAvatarList title={t("GROUP.ADMIN.FOUNDER")} userList={founders} />
      <UserAvatarList title={t("GROUP.ADMIN.MODERATOR")} userList={moderators} />
    </div>
  );
}
