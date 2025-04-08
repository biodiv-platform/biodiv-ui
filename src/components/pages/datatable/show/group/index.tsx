import { Box, Separator } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { axUserGroupDatatableUpdate } from "@services/datatable.service";
import { hasAccess } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";

import GroupPost from "../../../observation/show/groups/group-post";

export default function Group({ datatableId, groups, defaultGroups }) {
  const { t } = useTranslation();
  const { isLoggedIn } = useGlobalState();

  const [hideFeature, setHideFeature] = useState(true);

  useEffect(() => {
    setHideFeature(!hasAccess([Role.Admin, Role.UsergroupFounder]));
  }, [isLoggedIn]);

  const defaultGroup = useMemo(
    () => groups?.filter((item) => defaultGroups?.includes(item.id)),
    []
  );

  return (
    <Box
      mb={4}
      className="white-box"
      data-hidden={!SITE_CONFIG.USERGROUP.ACTIVE && hideFeature}
    >
      <BoxHeading>👥 {t("common:usergroups")}</BoxHeading>
      <Separator />
      <Box>
        <GroupPost
          groups={groups}
          selectedDefault={defaultGroup}
          resourceId={datatableId}
          saveUserGroupsFunc={axUserGroupDatatableUpdate}
          isDataTable={true}
        />
      </Box>
    </Box>
  );
}
