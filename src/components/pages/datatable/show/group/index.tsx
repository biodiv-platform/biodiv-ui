import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { UserGroupIbp } from "@interfaces/observation";
import { axUserGroupDatatableUpdate } from "@services/datatable.service";
import { axGetUserGroupList } from "@services/usergroup.service";
import { hasAccess } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import GroupPost from "../../../observation/show/groups/group-post";

export default function Group({ datatableId, defaultGroups }) {
  const { t } = useTranslation();
  const { isLoggedIn } = useGlobalState();

  const [hideFeature, setHideFeature] = useState(true);
  const [loggedInUserGroups, setLoggedInUserGroups] = useState<UserGroupIbp[]>();

  useEffect(() => {
    setHideFeature(!hasAccess([Role.Admin, Role.UsergroupFounder]));
    axGetUserGroupList().then(({ data }) => setLoggedInUserGroups(data));
  }, [isLoggedIn]);

  return (
    <Box m={4} className="white-box" data-hidden={!SITE_CONFIG.USERGROUP.ACTIVE && hideFeature}>
      <BoxHeading>👥 {t("common:usergroups")}</BoxHeading>
      <Box m={4}>
        <GroupPost
          groups={loggedInUserGroups}
          selectedDefault={defaultGroups}
          resourceId={datatableId}
          saveUserGroupsFunc={axUserGroupDatatableUpdate}
        />
      </Box>
    </Box>
  );
}
