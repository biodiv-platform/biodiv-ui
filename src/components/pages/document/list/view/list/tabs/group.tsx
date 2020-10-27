import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import GroupPost from "@components/pages/observation/show/groups/group-post";
import useTranslation from "@hooks/use-translation";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { axDocumentSaveUserGroups } from "@services/document.service";
import React from "react";

export default function GroupsTab({ tabIndex, o }) {
  const { t } = useTranslation();
  const { loggedInUserGroups } = useDocumentFilter();

  return tabIndex === 1 ? (
    o.userGroupIbp[0]?.id ? (
      <>
        <BoxHeading>👥 {t("OBSERVATION.USERGROUPS")}</BoxHeading>
        <Box minHeight="18rem" p={4}>
          <GroupPost
            groups={loggedInUserGroups}
            selectedDefault={o.userGroupIbp.map((item) => ({
              ...item,
              webAddress: item.webaddress
            }))}
            resourceId={o.document.id}
            saveUserGroupsFunc={axDocumentSaveUserGroups}
          />
        </Box>
      </>
    ) : (
      <Box p={4}>{t("DOCUMENT.NO_USERGROUP")}</Box>
    )
  ) : null;
}
