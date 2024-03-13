import { IconButton, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import styled from "@emotion/styled";
import AddCircleIcon from "@icons/add-circle";
import CrossIcon from "@icons/cross";
import MenuIcon from "@icons/menu";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
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

  ${Mq.max.lg} {
    width: 100%;
    button,
    .button {
      display: initial;
    }
  }
`;

export default function PrimaryLogo({ isOpen, onToggle }) {
  const { t, lang } = useTranslation();

  return (
    <Logo>
      <Link href={SITE_CONFIG.SITE.URL} className="logo">
        {SITE_CONFIG.SITE.TITLE?.[lang]}
      </Link>
      <LocalLink href="/observation/create" prefixGroup={true}>
        <Link
          p={2}
          lineHeight={1}
          className="button"
          aria-label={t("header:menu_primary.contribute.add_observation")}
        >
          <AddCircleIcon />
        </Link>
      </LocalLink>
      <IconButton
        onClick={onToggle}
        ml={2}
        p={2}
        variant="link"
        icon={isOpen ? <CrossIcon /> : <MenuIcon />}
        aria-label="toggle primary menu"
      />
    </Logo>
  );
}
