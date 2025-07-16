import { Box, Tabs } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { Featured, ObservationUserPermission, UserGroupIbp } from "@interfaces/observation";
import { hasAccess } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import GroupFeature from "./group-feature";
import GroupPost from "./group-post";

interface IGroupsProps {
  observationGroups: UserGroupIbp[] | undefined;
  permission: ObservationUserPermission | undefined;
  featured: Featured[] | undefined;
  resourceId;
  resourceType;
  saveUserGroupsFunc;
  featureFunc;
  unfeatureFunc;
}

const Groups = ({
  observationGroups,
  permission,
  featured,
  resourceId,
  resourceType,
  saveUserGroupsFunc,
  featureFunc,
  unfeatureFunc
}: IGroupsProps) => {
  const { isLoggedIn } = useGlobalState();
  const { t } = useTranslation();
  const [hideFeature, setHideFeature] = useState(true);

  useEffect(() => {
    setHideFeature(!hasAccess([Role.Admin, Role.UsergroupFounder]));
  }, [isLoggedIn]);

  return (
    <Box mb={4} className="white-box" data-hidden={!SITE_CONFIG.USERGROUP.ACTIVE} p={2}>
      <Tabs.Root lazyMount={true} defaultValue={"userGroups"}>
        <Tabs.List>
          <Tabs.Trigger value="userGroups">👥 {t("common:usergroups")}</Tabs.Trigger>
          <Tabs.Trigger hidden={hideFeature} value="hideFeature">
            🌟 {t("common:feature_in_groups")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="userGroups">
          <GroupPost
            groups={permission?.userGroupMember}
            selectedDefault={observationGroups}
            resourceId={resourceId}
            saveUserGroupsFunc={saveUserGroupsFunc}
          />
        </Tabs.Content>
        <Tabs.Content value="hideFeature">
          <GroupFeature
            groups={permission?.userGroupFeature}
            selectedDefault={featured}
            resourceId={resourceId}
            resourceType={resourceType}
            featureFunc={featureFunc}
            unfeatureFunc={unfeatureFunc}
          />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default Groups;
