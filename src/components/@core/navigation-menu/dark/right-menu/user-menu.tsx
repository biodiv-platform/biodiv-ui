import { Avatar, Icon, Link, Menu, MenuButton } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import { getUserImage } from "@utils/media";
import { useStoreState } from "easy-peasy";
import React from "react";

import SubMenu from "../../common/sub-menu";
import LoginButton from "./login";

export default function UserMenu() {
  const { isLoggedIn, user } = useStoreState((s) => s);
  const { t } = useTranslation();

  const userMenuRows = [
    {
      name: "MY_PROFILE",
      to: `/user/show/${user.id}`
    },
    {
      active: SITE_CONFIG.LEADERBOARD.ACTIVE,
      name: "LEADERBOARD",
      to: `/user/leaderboard`
    },
    {
      active: SITE_CONFIG.OBSERVATION.ACTIVE,
      name: "MY_OBSERVATIONS",
      to: `/observation/list`,
      params: { user: user.id }
    },
    {
      name: "LOGOUT",
      to: `/logout`
    }
  ];

  return isLoggedIn ? (
    <Menu>
      {({ onClose }) => (
        <>
          <MenuButton
            as={Link}
            role="button"
            tabIndex={0}
            aria-label={t("HEADER.MENU_PRIMARY.SETTINGS.TITLE")}
          >
            <Avatar
              showBorder={true}
              size="xs"
              mr={2}
              name={user.name}
              src={getUserImage(user.profilePic)}
            />
            {user.name} <Icon name="chevron-down" />
          </MenuButton>
          <SubMenu onClose={onClose} rows={userMenuRows} prefix="HEADER.MENU_PRIMARY.SETTINGS." />
        </>
      )}
    </Menu>
  ) : (
    <LoginButton />
  );
}
