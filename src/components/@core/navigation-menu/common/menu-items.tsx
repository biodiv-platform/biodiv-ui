import { Box, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuChevronDown } from "react-icons/lu";

import { MenuRoot, MenuTrigger } from "@/components/ui/menu";

import GroupedSubMenu from "./grouped-sub-menu";
import SubMenu from "./sub-menu";

const SimpleLink = ({ children, to, params }) => (
  <LocalLink href={to} params={params} prefixGroup={true}>
    <Link>{children}</Link>
  </LocalLink>
);

export default function MenuItems(props) {
  const { name, nameIcon: NameIcon, to, rows = [], cell: CCell, params, isLazy } = props;
  const isDropdown = rows.length > 0 || CCell;
  const { t } = useTranslation();

  const isContributeMenu = name === "header:menu_primary.contribute.";

  return isDropdown ? (
    <MenuRoot positioning={{ placement: "bottom-end" }} lazyMount={isLazy}>
      <>
        <MenuTrigger data-label={name} role="button" asChild pl={4}>
          <Box display="flex" alignItems="center">
            {NameIcon && <NameIcon mr={1} />}
            {t(`${name}title`)}
            <Box as="button" role="button" tabIndex={0}>
              <LuChevronDown />
            </Box>
          </Box>
        </MenuTrigger>
        {CCell ? (
          <CCell />
        ) : isContributeMenu ? (
          <GroupedSubMenu rows={rows} prefix={name} />
        ) : (
          <SubMenu rows={rows} prefix={name} />
        )}
      </>
    </MenuRoot>
  ) : (
    <SimpleLink to={to} params={params}>
      {NameIcon && <NameIcon mr={1} />}
      {t(`${name}title`)}
    </SimpleLink>
  );
}
