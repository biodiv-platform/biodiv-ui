import { MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import React from "react";

const SubMenuLink = ({ item, onClose }) => (
  <>
    <LocalLink href={item.to} params={item.params} prefixGroup={true}>
      <MenuItem as="a" w="full" onClick={onClose} fontWeight={item?.rows ? "bold" : "normal"}>
        {item.name}
      </MenuItem>
    </LocalLink>
    {item?.rows && item.rows.map((i) => <SubMenuLink item={i} onClose={onClose} key={i.name} />)}
    {item?.rows && <MenuDivider />}
  </>
);

export default function PagesMenuItem({ onClose }) {
  const { pages } = useGlobalState();
  const { t } = useTranslation();

  return (
    <MenuList maxH="18.5rem" overflow="auto">
      {pages.length ? (
        pages.map((item) => <SubMenuLink item={item} onClose={onClose} key={item.name} />)
      ) : (
        <LocalLink href="/page/empty">
          <MenuItem as="a" w="full" onClick={onClose}>
            {t("HEADER.MENU_SECONDARY.PAGES.EMPTY")}
          </MenuItem>
        </LocalLink>
      )}
    </MenuList>
  );
}
