import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
import React from "react";

import UserLocationMap from "../user-location-map";
import ObservationTab from "./observation";
import UserAbout from "./user-about";

export default function UserInfoTabs({ user }) {
  const { t } = useTranslation();

  return (
    <Box gridColumn={{ md: "2/5" }} mb={8}>
      <div className="white-box">
        <Tabs isLazy={true}>
          <TabList>
            <Tab>👤 {t("USER.ABOUT")}</Tab>
            <Tab>🐾 {t("USER.OBSERVATIONS.TITLE")}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <UserLocationMap coordinates={[user.longitude, user.latitude]} />
              <UserAbout user={user} />
            </TabPanel>
            <TabPanel pb={0}>
              <ObservationTab userId={user.id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Box>
  );
}
