import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";
import UserAboutTab from "./user-about";

export default function UserEditTabs({ user, isAdmin }) {
  const { t } = useTranslation();

  return (
    <Box gridColumn={{ md: "2/5" }} mb={4}>
      <div className="white-box">
        <Tabs>
          <TabList>
            <Tab>👤 {t("USER.ABOUT")}</Tab>
            <Tab>🔑 {t("USER.CHANGE_PASSWORD")}</Tab>
            <Tab>🔔 {t("USER.NOTIFICATIONS")}</Tab>
            {isAdmin && <Tab>🛡️ {t("USER.PERMISSIONS")}</Tab>}
          </TabList>
          <TabPanels p={4}>
            <TabPanel>
              <UserAboutTab user={user} />
            </TabPanel>
            <TabPanel>TBA</TabPanel>
            <TabPanel>TBA</TabPanel>
            {isAdmin && <TabPanel>TBA</TabPanel>}
          </TabPanels>
        </Tabs>
      </div>
    </Box>
  );
}
