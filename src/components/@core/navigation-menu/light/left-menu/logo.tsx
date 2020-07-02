import { Icon, Link, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import styled from "@emotion/styled";
import { useStoreState } from "easy-peasy";
import { Mq } from "mq-styled-components";
import React from "react";

import JoinUserGroup from "../join-group";

const Logo = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0;
  min-height: 3.4rem;

  a {
    display: flex;
    align-items: center;
    line-height: 1.2rem;
    img {
      height: 3.75rem;
      width: 8rem;
      object-fit: contain;
    }
  }

  button.ibpmenu {
    display: none;
    padding: 0.5rem;
    font-size: 1.5rem;
  }

  ${Mq.max.sm} {
    width: 100%;
    a {
      img {
        width: 4rem;
      }
    }
    button.ibpmenu {
      display: initial;
    }
  }

  ${Mq.min.md + " and (max-width: 768px)"} {
    padding: 0.5rem 0;
  }
`;

export default function PrimaryLogo({ isOpen, onToggle }) {
  const {
    currentGroup: { name, icon, id },
    isLoggedIn
  } = useStoreState((s) => s);

  return (
    <Logo>
      <LocalLink href="/" prefixGroup={true}>
        <Link>
          <img src={`${icon}?w=128`} alt={name} />
          <Text ml={2}>{name}</Text>
        </Link>
      </LocalLink>
      {isLoggedIn && id && <JoinUserGroup />}
      <button className="ibpmenu" onClick={onToggle} aria-label="toggle primary menu">
        <Icon name={isOpen ? "ibpcross" : "ibpmenu"} />
      </button>
    </Logo>
  );
}
