import { Box, Flex, Tabs } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useGlobalState from "@/hooks/use-global-state";
import { getInjectableHTML } from "@/utils/text";

import UserLocationMap from "./about/user-location-map";
import ObservationTab from "./observation";
import UserGroupListTab from "./usergroup";

const UserAbout = dynamic(() => import("./about/user-about"), { ssr: false });

export default function UserInfoTabs({ user, tab }) {
  const { t } = useTranslation();
  const { user: loggedInUser, announcement, languageId } = useGlobalState();

  return (
    <Box gridColumn={{ md: "2/5" }} mb={8}>
      <Tabs.Root defaultValue={tab} lazyMount key={tab}>
        <Tabs.List>
          <Tabs.Trigger value="about">👤 {t("user:about")}</Tabs.Trigger>
          <Tabs.Trigger value="observation">🐾 {t("user:observations.title")}</Tabs.Trigger>
          <Tabs.Trigger value="usergroups">👥 {t("common:usergroups")}</Tabs.Trigger>
          {loggedInUser.id == user.id && (
            <Tabs.Trigger value="notifications">🔵 {t("user:notifications")}</Tabs.Trigger>
          )}
        </Tabs.List>
        <Tabs.Content value="about" px={0}>
          <UserLocationMap coordinates={[user.longitude, user.latitude]} />
          <UserAbout user={user} tab={tab}/>
        </Tabs.Content>
        <Tabs.Content value="observation" px={0}>
          <ObservationTab userId={user.id} />
        </Tabs.Content>
        <Tabs.Content value="usergroups" px={0}>
          <UserGroupListTab />
        </Tabs.Content>
        <Tabs.Content value="notifications" px={0}>
          <Box mb={4} className="white-box">
            {announcement != null ? (
              <Box p={4}>
                {announcement.map((item) => (
                  <Box p={2}>
                    <Box bg={item.bgColor} p={3} borderRadius={"sm"}>
                      <Flex justify="space-between" align="center" gap={2}>
                        <Flex align="center" flex="1" gap={3}>
                          <Box
                            fontSize="sm"
                            fontWeight="medium"
                            color={item.color}
                            dangerouslySetInnerHTML={{
                              __html: getInjectableHTML(item.translations[languageId]||item.translations[SITE_CONFIG.LANG.DEFAULT_ID])
                            }}
                          ></Box>
                        </Flex>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : null}
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
