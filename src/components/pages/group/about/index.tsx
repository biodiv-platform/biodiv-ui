import { Badge, Flex } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import HomeDescription from "@components/pages/home/description";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import AdminImageList from "../common/admin-image-list";
import FilterIconsList from "./filter-icon-list";
import MapDrawView from "./map-draw-view";

interface GroupEditPageProps {
  speciesGroups;
  habitats;
  customFieldList;
  allCustomField;
  groupInfo;
  founders;
  moderators;
}

export default function AboutGroupComponent({
  speciesGroups,
  habitats,
  groupInfo: {
    description,
    name,
    allowUserToJoin,
    speciesGroupId,
    habitatId,
    neLongitude,
    neLatitude,
    swLatitude,
    swLongitude
  },
  founders,
  moderators
}: GroupEditPageProps) {
  const { t } = useTranslation();
  const coordinates = `${neLongitude},${neLatitude},${neLongitude},${swLatitude},${swLongitude},${swLatitude},${swLongitude},${neLatitude},${neLongitude},${neLatitude}`;

  return (
    <div className="container mt">
      <Flex alignItems="center">
        <PageHeading>👥 {`${t("GROUP.ABOUT.TITLE")} ${name}`}</PageHeading>
        <Flex m={6} alignItems="center">
          <Badge variantColor={allowUserToJoin ? "blue" : "yellow"}>
            {allowUserToJoin ? t("GROUP.ABOUT.OPEN_GROUP") : t("GROUP.ABOUT.CLOSED_GROUP")}
          </Badge>
        </Flex>
      </Flex>
      <HomeDescription description={description} />
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
      <MapDrawView coordinates={coordinates} title={t("GROUP.SPATIAL_COVERGE")} />
      <AdminImageList title={t("GROUP.ADMIN.FOUNDER")} adminList={founders} />
      <AdminImageList title={t("GROUP.ADMIN.MODERATOR")} adminList={moderators} />
    </div>
  );
}
