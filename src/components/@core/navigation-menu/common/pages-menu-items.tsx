import { Box, Menu, Portal } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";
import { LuChevronDown } from "react-icons/lu";

const SimpleLink = ({ children, to, params }) => (
  <LocalLink href={to} params={params} prefixGroup={true}>
    {children}
  </LocalLink>
);

export default function MenuItems(props) {
  const { name, to, rows = [], params, isLazy } = props;
  const isDropdown = rows.length > 0;

  return isDropdown ? (
    <Menu.Root positioning={{ placement: "bottom-end" }} lazyMount={isLazy}>
      <Menu.Trigger data-label={name} role="button" asChild pl={4}>
        <Box display="flex" alignItems="center">
          <SimpleLink to={to} params={params}>
            {name}
          </SimpleLink>
          <Box as="button" role="button" tabIndex={0}>
            <LuChevronDown />
          </Box>
        </Box>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {rows.map((row) => (
              <Menu.Item key={row.to} value={row.name} asChild>
                <LocalLink href={row.to} params={row.params} prefixGroup={true}>
                  {row.name}
                </LocalLink>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  ) : (
    <SimpleLink to={to} params={params}>
      {name}
    </SimpleLink>
  );
}
