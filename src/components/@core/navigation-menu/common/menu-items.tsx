import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link, Menu, MenuButton } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { hasAccess } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import SubMenu from "./sub-menu";

const XLink = ({ children, label, onClose, to, params, isArrow }) =>
  isArrow ? (
    // @ts-ignore
    <MenuButton as={Link} data-label={label} params={params} role="button" tabIndex={0}>
      {children} <ChevronDownIcon mt={[1, 0]} float={["right", "none"]} />
    </MenuButton>
  ) : (
    <LocalLink href={to} params={params} prefixGroup={true}>
      <Link onClick={onClose}>{children}</Link>
    </LocalLink>
  );

export default function MenuItems(props) {
  const { name, nameIcon: NameIcon, to = "", rows = [], cell: CCell, params, isLazy } = props;
  const isArrow = rows.length > 0 || CCell;
  const { t } = useTranslation();
  const activeSubMenuItems = useMemo(
    () => rows.filter(({ active = true, role }) => active && (role ? hasAccess(role) : true)),
    [rows]
  );

  return (
    <Menu placement="bottom-end" isLazy={isLazy}>
      {({ onClose, isOpen }) => (
        <>
          <XLink label={name} onClose={onClose} to={to} isArrow={isArrow} params={params}>
            {NameIcon && <NameIcon mr={1} />}
            {t(`${name}title`)}
          </XLink>
          {CCell ? (
            <CCell onClose={onClose} isOpen={isOpen} />
          ) : activeSubMenuItems.length ? (
            <SubMenu onClose={onClose} rows={activeSubMenuItems} prefix={name} />
          ) : null}
        </>
      )}
    </Menu>
  );
}
