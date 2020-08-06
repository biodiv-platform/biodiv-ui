import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import GroupPost from "@components/pages/observation/show/groups/group-post";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@hooks/useObservationFilter";
import { axSaveUserGroups } from "@services/observation.service";
import React from "react";

export default function GroupsTab({ tabIndex, o }) {
  const { t } = useTranslation();
  const { loggedInUserGroups } = useObservationFilter();

  return tabIndex === 2 ? (
    <>
      <BoxHeading>👥 {t("OBSERVATION.USERGROUPS")}</BoxHeading>
      <Box p={4}>
        <GroupPost
          groups={loggedInUserGroups}
          selectedDefault={o.userGroup}
          resourceId={o.observationId}
          saveUserGroupsFunc={axSaveUserGroups}
        />
      </Box>
    </>
  ) : null;
}
