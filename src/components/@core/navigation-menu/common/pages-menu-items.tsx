import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Link, Menu, MenuButton, useBreakpointValue } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";

import SubMenu from "./sub-menu";

const SimpleLink = ({ children, to, params }) => (
  <LocalLink href={to} params={params} prefixGroup={true}>
    <Link>{children}</Link>
  </LocalLink>
);

export default function PagesMenuItems(props) {
  const { name, nameIcon: NameIcon, to, rows = [], cell: CCell, params, isLazy } = props;
  const isDropdown = rows.length > 0 || CCell;

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const linkContent = (
    <>
      {NameIcon && <NameIcon mr={1} />}
      {name}
    </>
  );
  const desktopLinkStyle = { display: "flex", marginLeft: "20px" };

  const mobileLinkStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between"
  };
  const menuButton = (
    <Box
      as="button"
      role="button"
      tabIndex={0}
      display="flex"
      alignItems="left"
      mb={isDesktop ? 0 : 4}
    >
      <MenuButton data-label={name} role="button" tabIndex={0}>
        <ChevronDownIcon aria-label="Open Menu" mt={[1, 0]} float={["right", "none"]} />
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
            (CCell ? <CCell /> : <SubMenu rows={rows} prefix={name} isPage={true} />)}
        </>
      )}
    </Menu>
  ) : (
    <SimpleLink to={to} params={params}>
      {linkContent}
    </SimpleLink>
  );
}
