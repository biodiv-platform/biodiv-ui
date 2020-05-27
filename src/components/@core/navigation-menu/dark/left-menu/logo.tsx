import { Icon, IconButton, Link } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import React from "react";

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0;
  min-height: 3.4rem;

  a.logo {
    flex-grow: 1;
  }

  button,
  .button {
    flex-shrink: 0;
    display: none;
    color: white;
    font-size: 1.5rem;
  }

  ${Mq.max.sm} {
    width: 100%;
    button,
    .button {
      display: initial;
    }
  }
`;

export default function PrimaryLogo({ isOpen, onToggle }) {
  const { t } = useTranslation();
  return (
    <Logo>
      <LocalLink href="/">
        <Link className="logo">{process.env.NEXT_PUBLIC_SITE_TITLE}</Link>
      </LocalLink>
      <LocalLink href="/observation/create" prefixGroup={true}>
        <Link
          p={2}
          lineHeight={1}
          className="button"
          aria-label={t("HEADER.MENU_PRIMARY.CONTRIBUTE.ADD_OBSERVATION")}
        >
          <Icon name="ibpaddcircle" />
        </Link>
      </LocalLink>
      <IconButton
        onClick={onToggle}
        ml={2}
        p={2}
        variant="link"
        icon={(isOpen ? "ibpcross" : "ibpmenu") as any}
        aria-label="toggle primary menu"
      />
    </Logo>
  );
}
