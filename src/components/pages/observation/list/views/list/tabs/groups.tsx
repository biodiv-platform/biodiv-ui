import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import GroupPost from "@components/pages/observation/show/groups/group-post";
import useTranslation from "@hooks/use-translation";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { axSaveUserGroups } from "@services/observation.service";
import React from "react";

export default function GroupsTab({ o }) {
  const { t } = useTranslation();
  const { loggedInUserGroups } = useObservationFilter();

  return (
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
  );
}
