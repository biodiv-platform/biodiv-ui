import { Box, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";
import { LuChevronDown } from "react-icons/lu";

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

const SimpleLink = ({ children, to, params }) => (
  <LocalLink href={to} params={params} prefixGroup={true}>
    {children}
  </LocalLink>
);

export default function MenuItems(props) {
  const { name, to, rows = [], params, isLazy } = props;
  const isDropdown = rows.length > 0;

  return isDropdown ? (
    <MenuRoot positioning={{ placement: "bottom-end" }} lazyMount={isLazy}>
      <MenuTrigger data-label={name} role="button" asChild pl={4}>
        <Box display="flex" alignItems="center">
          <Link>{name}</Link>
          <Box as="button" role="button" tabIndex={0}>
            <LuChevronDown />
          </Box>
        </Box>
      </MenuTrigger>

      <MenuContent>
        {rows.map((row, index) => (
          <MenuItem key={index} value={index}>
            <SimpleLink to={to} params={params}>
              {row.name}
            </SimpleLink>
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  ) : (
    <SimpleLink to={to} params={params}>
      {name}
    </SimpleLink>
  );
}
