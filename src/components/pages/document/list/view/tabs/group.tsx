import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import GroupPost from "@components/pages/observation/show/groups/group-post";
import { axDocumentSaveUserGroups } from "@services/document.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function GroupsTab({ o }) {
  const { t } = useTranslation();
  const { loggedInUserGroups } = useDocumentFilter();

  return (
    <>
      <BoxHeading>👥 {t("common:usergroups")}</BoxHeading>
      <Box minHeight="18rem" p={4}>
        <GroupPost
          groups={loggedInUserGroups}
          selectedDefault={o.userGroupIbp}
          resourceId={o.document.id}
          saveUserGroupsFunc={axDocumentSaveUserGroups}
        />
      </Box>
    </>
  );
}
