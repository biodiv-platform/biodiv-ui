import SITE_CONFIG from "@configs/site-config";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import React from "react";

import MainItems from "../../common/menu-items";
import items from "./items";
import LanguageSwitcher from "./language-switcher";
import Search from "./search";
import UserMenu from "./user-menu";

interface IMenuProps {
  isOpen;
}

const RightMenuContainer = styled.div`
  display: flex;
  align-items: center;
  z-index: 4;
  & > a {
    margin-left: 1rem;
    white-space: pre;
  }

  ${Mq.max.sm} {
    width: 100%;
    flex-direction: column;
    & > a {
      width: 100%;
      margin-left: 0;
      margin-bottom: 1rem;
    }
    &[aria-expanded="false"] {
      display: none;
    }
  }

  [data-label="ibpadd"] {
    background: var(--chakra-colors-gray-700);
    border-radius: 2rem;
    padding: 0.4rem 0.7rem;
  }

  [role="menu"] {
    color: initial;
  }
`;

const activeItems = items.filter(({ active = true }) => active);

export default function RightMenu({ isOpen }: IMenuProps) {
  return (
    <RightMenuContainer aria-expanded={isOpen}>
      <Search />
      {activeItems.map((item) => (
        <MainItems key={item.name} {...item} />
      ))}
      {SITE_CONFIG.LANG.SWITCHER && <LanguageSwitcher />}
      <UserMenu />
    </RightMenuContainer>
  );
}
