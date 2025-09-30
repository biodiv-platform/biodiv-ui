import { Box, Button, Flex, Menu, Portal } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuChevronDown } from "react-icons/lu";

import { Avatar } from "@/components/ui/avatar";

import SubMenu from "../../common/sub-menu";
import LoginButton from "./login";

export default function UserMenu() {
  const { isLoggedIn, user, open } = useGlobalState();
  const { t } = useTranslation();

  const userMenuRows = [
    {
      name: "my_notifications"
    },
    {
      name: "my_profile",
      to: `/user/show/${user?.id}`
    },
    {
      active: SITE_CONFIG.LEADERBOARD.ACTIVE,
      name: "leaderboard",
      to: `/user/leaderboard`
    },
    {
      active: SITE_CONFIG.OBSERVATION.ACTIVE,
      name: "my_observations",
      to: `/observation/list`,
      params: { user: user?.id }
    },
    {
      name: "logout",
      to: `/logout`
    }
  ];

  return isLoggedIn ? (
    <Menu.Root positioning={{ placement: "bottom-end" }} lazyMount>
      <Menu.Trigger tabIndex={0} aria-label={t("header:menu_primary.settings.title")} asChild>
        <Button
          variant="plain"
          size="sm"
          color="inherit"
          px={0}
          width={{ base: "100%", lg: "auto" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex align="center">
            <Avatar
              size="xs"
              mr={2}
              name={user?.name}
              src={getUserImage(user?.profile_pic, user.name)}
            />
            {user?.name}
            {!open && <Box
              w="8px"
              h="8px"
              bg="red.500"
              borderRadius="full"
              ml={2}
            />}
          </Flex>
          <LuChevronDown />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <SubMenu rows={userMenuRows} prefix="header:menu_primary.settings." />
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  ) : (
    <LoginButton />
  );
}
