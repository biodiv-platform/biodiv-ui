import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, Link, Menu, MenuButton } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import SubMenu from "../../common/sub-menu";
import LoginButton from "./login";

export default function UserMenu() {
  const { isLoggedIn, user } = useGlobalState();
  const { t } = useTranslation();

  const userMenuRows = [
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
    <Menu placement="bottom-end" isLazy={true}>
      <MenuButton
        as={Link}
        role="button"
        tabIndex={0}
        aria-label={t("header:menu_primary.settings.title")}
      >
        <Avatar
          size="xs"
          mr={2}
          name={user?.name}
          src={getUserImage(user?.profile_pic, user.name)}
        />
        {user?.name} <ChevronDownIcon />
      </MenuButton>
      <SubMenu rows={userMenuRows} prefix="header:menu_primary.settings." />
    </Menu>
  ) : (
    <LoginButton />
  );
}
