import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import UserLocationMap from "./about/user-location-map";
import ObservationTab from "./observation";
import UserGroupListTab from "./usergroup";

const UserAbout = dynamic(() => import("./about/user-about"), { ssr: false });

export default function UserInfoTabs({ user }) {
  const { t } = useTranslation();

  return (
    <Box gridColumn={{ md: "2/5" }} mb={8}>
      <Tabs isLazy={true} variant="soft-rounded">
        <TabList>
          <Tab>👤 {t("user:about")}</Tab>
          <Tab>🐾 {t("user:observations.title")}</Tab>
          <Tab>👥 {t("common:usergroups")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <UserLocationMap coordinates={[user.longitude, user.latitude]} />
            <UserAbout user={user} />
          </TabPanel>
          <TabPanel pb={0}>
            <ObservationTab userId={user.id} />
          </TabPanel>
          <TabPanel>
            <UserGroupListTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
