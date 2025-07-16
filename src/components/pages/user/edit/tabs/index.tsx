import { Box, Tabs } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
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
        <Tabs.Root lazyMount defaultValue="about" size={"lg"} p={4}>
          <Tabs.List>
            <Tabs.Trigger value="about">👤 {t("user:about")}</Tabs.Trigger>
            <Tabs.Trigger value="password">🔑 {t("user:change_password")}</Tabs.Trigger>
            <Tabs.Trigger value="notifications">🔔 {t("user:notifications")}</Tabs.Trigger>
            {isAdmin && <Tabs.Trigger value="permision">🛡️ {t("user:permissions")}</Tabs.Trigger>}
          </Tabs.List>
          <Tabs.Content value="about">
            <UserAboutTab user={user} isAdmin={isAdmin} />
          </Tabs.Content>
          <Tabs.Content value="password">
            <ChangePasswordTab userId={user.id} />
          </Tabs.Content>
          <Tabs.Content value="notifications">
            <NotificationsTab user={user} />
          </Tabs.Content>
          {isAdmin && (
            <Tabs.Content value="permision">
              <PermissionsTab user={user} />
            </Tabs.Content>
          )}
        </Tabs.Root>
      </div>
    </Box>
  );
}
