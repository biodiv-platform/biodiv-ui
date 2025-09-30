import { Box, Tabs } from "@chakra-ui/react";
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
      <Tabs.Root defaultValue="about" lazyMount>
        <Tabs.List>
          <Tabs.Trigger value="about">👤 {t("user:about")}</Tabs.Trigger>
          <Tabs.Trigger value="observation">🐾 {t("user:observations.title")}</Tabs.Trigger>
          <Tabs.Trigger value="usergroups">👥 {t("common:usergroups")}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="about" px={0}>
          <UserLocationMap coordinates={[user.longitude, user.latitude]} />
          <UserAbout user={user} />
        </Tabs.Content>
        <Tabs.Content value="observation" px={0}>
          <ObservationTab userId={user.id} />
        </Tabs.Content>
        <Tabs.Content value="usergroups" px={0}>
          <UserGroupListTab />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
