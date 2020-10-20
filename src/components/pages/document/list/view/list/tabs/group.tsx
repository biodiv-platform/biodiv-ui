import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import GroupPost from "@components/pages/observation/show/groups/group-post";
import useTranslation from "@hooks/use-translation";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { axDocumentSaveUserGroups } from "@services/document.service";
import React from "react";

export default function GroupsTab({ tabIndex, o }) {
  const { t } = useTranslation();
  const { loggedInUserGroups } = useObservationFilter();

  return tabIndex === 1 ? (
    o.userGroupIbp?.length > 0 ? (
      <>
        <BoxHeading>👥 {t("OBSERVATION.USERGROUPS")}</BoxHeading>
        <Box p={4}>
          <GroupPost
            groups={loggedInUserGroups}
            selectedDefault={o.userGroupIbp}
            resourceId={o.document.id}
            saveUserGroupsFunc={axDocumentSaveUserGroups}
          />
        </Box>
      </>
    ) : (
      <Box p={4}>{t("OBSERVATION.NO_CUSTOM_FIELD")}</Box>
    )
  ) : null;
}
