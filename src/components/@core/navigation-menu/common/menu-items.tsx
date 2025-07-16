import { Button, Flex, Menu, Portal } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuChevronDown } from "react-icons/lu";

import GroupedSubMenu from "./grouped-sub-menu";
import SubMenu from "./sub-menu";

const SimpleLink = ({ children, to, params }) => (
  <LocalLink href={to} params={params} prefixGroup={true}>
    {children}
  </LocalLink>
);

export default function MenuItems(props) {
  const { name, nameIcon: NameIcon, to, rows = [], cell: CCell, params, isLazy } = props;
  const isDropdown = rows.length > 0 || CCell;
  const { t } = useTranslation();

  const isContributeMenu = name === "header:menu_primary.contribute.";

  return isDropdown ? (
    <Menu.Root positioning={{ placement: "bottom-end" }} lazyMount={isLazy}>
      <Menu.Trigger data-label={name} role="button" asChild>
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
            {NameIcon && <NameIcon />}
            {t(`${name}title`)}
          </Flex>
          <LuChevronDown />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          {CCell ? (
            <CCell />
          ) : isContributeMenu ? (
            <GroupedSubMenu rows={rows} prefix={name} />
          ) : (
            <SubMenu rows={rows} prefix={name} />
          )}
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  ) : (
    <SimpleLink to={to} params={params}>
      <Flex align="center" gap={2}>
        {NameIcon && <NameIcon />}
        {t(`${name}title`)}
      </Flex>
    </SimpleLink>
  );
}
