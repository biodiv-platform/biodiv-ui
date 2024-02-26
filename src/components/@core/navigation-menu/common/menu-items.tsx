import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Link, Menu, MenuButton, useBreakpointValue } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import GroupedSubMenu from "./grouped-sub-menu";
import SubMenu from "./sub-menu";

const SimpleLink = ({ children, to, params }) => (
  <LocalLink href={to} params={params} prefixGroup={true}>
    <Link>{children}</Link>
  </LocalLink>
);

export default function MenuItems(props) {
  const { name, nameIcon: NameIcon, to, rows = [], cell: CCell, params, isLazy, isPage } = props;
  const isDropdown = rows.length > 0 || CCell;
  const { t } = useTranslation();

  const isContributeMenu = name === "header:menu_primary.contribute.";
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const linkContent = (
    <>
      {NameIcon && <NameIcon mr={1} />}
      {isPage ? name : t(`${name}title`)}
    </>
  );
  const desktopLinkStyle = { display: "flex", alignItems: "center", marginLeft: "20px" };
  const mobileLinkStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    mr: 1
  };
  const menuButton = (
    <Box
      as="button"
      role="button"
      tabIndex={0}
      ml={2}
      display="flex"
      alignItems="left"
      mb={isDesktop ? 0 : 4}
    >
      <MenuButton data-label={isPage ? name : t(`${name}title`)} role="button" tabIndex={0}>
        <ChevronDownIcon aria-label="Open Menu" />
      </MenuButton>
    </Box>
  );

  return isDropdown ? (
    <Menu placement="bottom-end" isLazy={isLazy}>
      {({ isOpen }) => (
        <>
          <Box sx={isDesktop ? desktopLinkStyle : mobileLinkStyle}>
            <SimpleLink to={to} params={params}>
              {linkContent}
            </SimpleLink>
            {menuButton}
          </Box>
          {(isLazy ? isOpen : true) &&
            (CCell ? (
              <CCell />
            ) : isContributeMenu ? (
              <GroupedSubMenu rows={rows} prefix={name} />
            ) : (
              <SubMenu rows={rows} prefix={name} isPage={isPage} />
            ))}
        </>
      )}
    </Menu>
  ) : (
    <SimpleLink to={to} params={params}>
      {linkContent}
    </SimpleLink>
  );
}
