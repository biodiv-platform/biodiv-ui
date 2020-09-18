import { Link, MenuItem, MenuList } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import useGlobalState from "@hooks/useGlobalState";
import React, { useMemo } from "react";

export default function SubMenu({ rows, onClose, prefix = "" }) {
  const { t } = useTranslation();
  const activeSubMenuItems = useMemo(() => rows.filter(({ active = true }) => active), [rows]);
  const { isCurrentGroupMember, isLoggedIn } = useGlobalState();

  return (
    <MenuList>
      {activeSubMenuItems.map((item, index) => {
        const label = item.name && t(prefix + item.name);
        return (
          <MenuItem key={index}>
            {isLoggedIn && item.memberOnly && !isCurrentGroupMember ? (
              <Link w="full" onClick={() => alert(t("HEADER.MEMBER_ONLY"))}>
                {label}
              </Link>
            ) : (
              <LocalLink href={item.to} params={item.params} prefixGroup={true}>
                <Link w="full" onClick={onClose}>
                  {label}
                </Link>
              </LocalLink>
            )}
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
