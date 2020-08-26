import { Link, MenuDivider, MenuItem, MenuList } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/useGlobalState";
import React from "react";

export default function PagesMenuItem({ onClose }) {
  const { pages } = useGlobalState();

  const SubMenuLink = ({ item }) => (
    <>
      <MenuItem key={item.name}>
        <LocalLink href={item.to} params={item.params} prefixGroup={true}>
          <Link py={2} w="full" onClick={onClose} fontWeight={item?.rows ? "bold" : "normal"}>
            {item.name}
          </Link>
        </LocalLink>
      </MenuItem>
      {item?.rows && item.rows.map((item) => <SubMenuLink item={item} key={item.name} />)}
      {item?.rows && <MenuDivider />}
    </>
  );

  return (
    <MenuList maxH="18.5rem" overflow="auto" placement="bottom-end">
      {pages.map((item) => (
        <SubMenuLink item={item} key={item.name} />
      ))}
    </MenuList>
  );
}
