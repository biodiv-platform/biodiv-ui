import { Link, MenuItem, MenuList } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function SubMenu({ rows, onClose, prefix = "" }) {
  const { t } = useTranslation();

  return (
    <MenuList placement="bottom-end">
      {rows.map((item, index) => (
        <MenuItem key={index}>
          <LocalLink href={item.to} params={item.params} prefixGroup={true}>
            <Link py={2} w="full" onClick={onClose}>
              {item.name && t(prefix + item.name)}
            </Link>
          </LocalLink>
        </MenuItem>
      ))}
    </MenuList>
  );
}
