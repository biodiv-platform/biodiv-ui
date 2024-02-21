import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link, Menu, MenuButton } from "@chakra-ui/react";
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

  return isDropdown ? (
    <Menu placement="bottom-end" isLazy={isLazy}>
      {({ isOpen }) => (
        <>
          <MenuButton data-label={name} role="button" tabIndex={0}>
            {NameIcon && <NameIcon mr={1} />}
            {t(isPage ? `${name}` : `${name}title`)}
            <ChevronDownIcon mt={[1, 0]} float={["right", "none"]} />
          </MenuButton>
          {(isLazy ? isOpen : true) ? (
            CCell ? (
              <CCell />
            ) : isContributeMenu ? (
              <GroupedSubMenu rows={rows} prefix={name} />
            ) : (
              <SubMenu rows={rows} prefix={name} isPage={isPage} />
            )
          ) : null}
        </>
      )}
    </Menu>
  ) : (
    <SimpleLink to={to} params={params}>
      {NameIcon && <NameIcon mr={1} />}
      {t(isPage ? `${name}` : `${name}title`)}
    </SimpleLink>
  );
}
