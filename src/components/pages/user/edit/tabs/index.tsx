import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
import React from "react";

import NotificationsTab from "./notifications";
import ChangePasswordTab from "./password";
import PermissionsTab from "./permissions";
import UserAboutTab from "./user-about";

export default function UserEditTabs({ user, isAdmin }) {
  const { t } = useTranslation();

  return (
    <Box gridColumn={{ md: "2/5" }} mb={4}>
      <div className="white-box">
        <Tabs isLazy={true}>
          <TabList>
            <Tab>👤 {t("USER.ABOUT")}</Tab>
            <Tab>🔑 {t("USER.CHANGE_PASSWORD")}</Tab>
            <Tab>🔔 {t("USER.NOTIFICATIONS")}</Tab>
            {isAdmin && <Tab>🛡️ {t("USER.PERMISSIONS")}</Tab>}
          </TabList>
          <TabPanels p={4}>
            <TabPanel>
              <UserAboutTab user={user} isAdmin={isAdmin} />
            </TabPanel>
            <TabPanel>
              <ChangePasswordTab userId={user.id} />
            </TabPanel>
            <TabPanel>
              <NotificationsTab user={user} />
            </TabPanel>
            {isAdmin && (
              <TabPanel>
                <PermissionsTab user={user} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </div>
    </Box>
  );
}
