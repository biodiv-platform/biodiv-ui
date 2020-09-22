import { MenuDivider, MenuItem, MenuList } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import React from "react";

const SubMenuLink = ({ item, onClose }) => (
  <>
    <LocalLink href={item.to} params={item.params} prefixGroup={true}>
      <MenuItem as="a" w="full" onClick={onClose} fontWeight={item?.rows ? "bold" : "normal"}>
        {item.name}
      </MenuItem>
    </LocalLink>
    {item?.rows &&
      item.rows.map((item) => <SubMenuLink item={item} onClose={onClose} key={item.name} />)}
    {item?.rows && <MenuDivider />}
  </>
);

export default function PagesMenuItem({ onClose }) {
  const { pages } = useGlobalState();

  return (
    <MenuList maxH="18.5rem" overflow="auto">
      {pages.map((item) => (
        <SubMenuLink item={item} onClose={onClose} key={item.name} />
      ))}
    </MenuList>
  );
}
