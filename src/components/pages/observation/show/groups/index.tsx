import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useGlobalState from "@hooks/useGlobalState";
import { Role } from "@interfaces/custom";
import { Featured, ObservationUserPermission, UserGroupIbp } from "@interfaces/observation";
import { hasAccess } from "@utils/auth";
import React, { useEffect, useState } from "react";

import GroupFeature from "./group-feature";
import GroupPost from "./group-post";

interface IGroupsProps {
  observationGroups: UserGroupIbp[];
  permission: ObservationUserPermission;
  featured: Featured[];
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
    <Box mb={4} className="white-box">
      <Tabs>
        <TabList>
          <Tab>👥 {t("OBSERVATION.USERGROUPS")}</Tab>
          <Tab hidden={hideFeature}>🌟 {t("OBSERVATION.FEATURE_IN_GROUPS")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <GroupPost
              groups={permission?.userGroupMember}
              selectedDefault={observationGroups}
              resourceId={resourceId}
              saveUserGroupsFunc={saveUserGroupsFunc}
            />
          </TabPanel>
          <TabPanel>
            <GroupFeature
              groups={permission?.userGroupFeature}
              selectedDefault={featured}
              resourceId={resourceId}
              resourceType={resourceType}
              featureFunc={featureFunc}
              unfeatureFunc={unfeatureFunc}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Groups;
