import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import UserLocationMap from "../user-location-map";
import UserAbout from "./user-about";

export default function UserInfoTabs({ userDetails }) {
  const { t } = useTranslation();

  return (
    <Box gridColumn={{ md: "2/5" }}>
      <div className="white-box">
        <Tabs>
          <TabList>
            <Tab>{t("USER.ABOUT")}</Tab>
            <Tab>More</Tab>
          </TabList>
          <UserLocationMap coordinates={[userDetails.longitude, userDetails.latitude]} />
          <TabPanels p={4}>
            <TabPanel>
              <UserAbout userDetails={userDetails} />
            </TabPanel>
            <TabPanel>TBA</TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Box>
  );
}
