import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import GroupPost from "@components/pages/observation/show/groups/group-post";
import { axSaveUserGroups } from "@services/observation.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function GroupsTab({ o }) {
  const { t } = useTranslation();
  const { loggedInUserGroups } = useObservationFilter();

  return (
    <>
      <BoxHeading>👥 {t("common:usergroups")}</BoxHeading>
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
