import { Link, Menu, MenuButton } from "@chakra-ui/core";
import { ChevronDownIcon } from "@chakra-ui/icons";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

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
  const { name, nameIcon: NameIcon, to = "", rows = [], cell: CCell, params } = props;
  const isArrow = rows.length > 0 || CCell;
  const { t } = useTranslation();

  return (
    <Menu placement="bottom-end">
      {({ onClose }) => (
        <>
          <XLink label={name} onClose={onClose} to={to} isArrow={isArrow} params={params}>
            {NameIcon && <NameIcon mr={1} />}
            {t(`${name}TITLE`)}
          </XLink>
          {CCell ? (
            <CCell onClose={onClose} />
          ) : (
            <SubMenu onClose={onClose} rows={rows} prefix={name} />
          )}
        </>
      )}
    </Menu>
  );
}
