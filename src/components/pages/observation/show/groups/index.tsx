import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { Role } from "@interfaces/custom";
import { Featured, ObservationUserPermission, UserGroupIbp } from "@interfaces/observation";
import { hasAccess } from "@utils/auth";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

import GroupFeature from "./group-feature";
import GroupPost from "./group-post";

interface IGroupsProps {
  observationGroups: UserGroupIbp[];
  permission: ObservationUserPermission;
  featured: Featured[];
  observationId;
}

const Groups = ({ observationGroups, permission, featured, observationId }: IGroupsProps) => {
  const { isLoggedIn } = useStoreState((s) => s);
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
        <TabPanels p={4} pt={2}>
          <TabPanel>
            <GroupPost
              groups={permission?.userGroupMember}
              selectedDefault={observationGroups}
              observationId={observationId}
            />
          </TabPanel>
          <TabPanel>
            <GroupFeature
              groups={permission?.userGroupFeature}
              selectedDefault={featured}
              observationId={observationId}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Groups;
