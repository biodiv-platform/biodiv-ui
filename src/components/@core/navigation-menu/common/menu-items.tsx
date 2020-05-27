import { Icon, Link, Menu, MenuButton } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import SubMenu from "./sub-menu";

const MB: any = MenuButton;

const XLink = ({ children, label, onClose, to, params, isArrow }) =>
  isArrow ? (
    <MB as={Link} data-label={label} params={params} role="button" tabIndex={0}>
      {children} <Icon name="chevron-down" mt={[1, 0]} float={["right", "none"]} />
    </MB>
  ) : (
    <LocalLink href={to} params={params} prefixGroup={true}>
      <Link onClick={onClose}>{children}</Link>
    </LocalLink>
  );

export default function MenuItems(props) {
  const { name, nameIcon, to = "", rows = [], cell: CCell, params } = props;
  const isArrow = rows.length > 0 || CCell;
  const { t } = useTranslation();

  return (
    <Menu>
      {({ onClose }) => (
        <>
          <XLink label={nameIcon} onClose={onClose} to={to} isArrow={isArrow} params={params}>
            {nameIcon && <Icon name={nameIcon} mr={1} />}
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
