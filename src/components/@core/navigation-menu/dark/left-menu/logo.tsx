import { IconButton, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuCirclePlus, LuMenu, LuX } from "react-icons/lu";

import useGlobalState from "@/hooks/use-global-state";

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
  const { t } = useTranslation();
  const { siteInfo } = useGlobalState();

  return (
    <Logo>
      <Link href={SITE_CONFIG.SITE.URL} className="logo" unstyled>
        {siteInfo.title}
      </Link>
      <IconButton
        className="button"
        aria-label={t("header:menu_primary.contribute.add_observation")}
        unstyled
        asChild
      >
        <LocalLink href="/observation/create" prefixGroup={true}>
          <LuCirclePlus />
        </LocalLink>
      </IconButton>
      <IconButton onClick={onToggle} ml={2} unstyled aria-label="toggle primary menu">
        {isOpen ? <LuX /> : <LuMenu />}
      </IconButton>
    </Logo>
  );
}
