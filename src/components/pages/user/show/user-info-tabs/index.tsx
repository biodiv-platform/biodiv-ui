import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import React from "react";

import UserAbout from "./about/user-about";
import UserLocationMap from "./about/user-location-map";
import ObservationTab from "./observation";

export default function UserInfoTabs({ user }) {
  const { t } = useTranslation();

  return (
    <Box gridColumn={{ md: "2/5" }} mb={8}>
      <Tabs isLazy={true} variant="soft-rounded">
        <TabList>
          <Tab>👤 {t("USER.ABOUT")}</Tab>
          <Tab>🐾 {t("USER.OBSERVATIONS.TITLE")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <UserLocationMap coordinates={[user.longitude, user.latitude]} />
            <UserAbout user={user} />
          </TabPanel>
          <TabPanel pb={0}>
            <ObservationTab userId={user.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
