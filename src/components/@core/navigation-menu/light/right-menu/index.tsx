import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import React from "react";

import MainItems from "../../common/menu-items";
import items from "./items";

interface IMenuProps {
  isOpen;
}

const RightMenuContainer = styled.div`
  display: flex;
  align-items: center;
  z-index: 3;
  & > a {
    margin-left: 1.3rem;
    white-space: pre;
  }

  ${Mq.max.sm} {
    width: 100%;
    flex-direction: column;
    height: auto;
    & > a {
      width: 100%;
      margin-left: 0;
      margin-bottom: 1rem;
    }
    &[aria-expanded="false"] {
      height: 0px;
      overflow: hidden;
    }
  }

  [role="menu"] {
    color: initial;
  }
`;

export default function RightMenu({ isOpen }: IMenuProps) {
  return (
    <RightMenuContainer aria-expanded={isOpen} className="fade">
      {items.map((item) => (
        <MainItems key={item.name} {...item} />
      ))}
    </RightMenuContainer>
  );
}
