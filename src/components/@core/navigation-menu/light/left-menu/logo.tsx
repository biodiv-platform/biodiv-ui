import { Button, Icon, Link, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { adminOrAuthor } from "@utils/auth";
import { useStoreState } from "easy-peasy";
import { Mq } from "mq-styled-components";
import { useRouter } from "next/router";
import React from "react";

import JoinUserGroup from "../join-group";

const Logo = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0;
  min-height: 3.4rem;
  flex-wrap: wrap;

  .right-logo {
    display: contents;
  }

  a {
    display: flex;
    align-items: center;
    line-height: 1.2rem;
    img {
      height: 3.75rem;
      max-width: 8rem;
      object-fit: contain;
    }
  }

  .menu-toggle {
    display: none;
    padding: 0.5rem;
    font-size: 1.5rem;
  }

  .join-usergroup {
    margin-left: 0.75rem;
  }

  ${Mq.max.sm} {
    width: 100%;

    p {
      max-width: 6rem;
    }

    .menu-toggle {
      display: initial;
    }

    .join-usergroup {
      flex-basis: 100%;
      margin: 0.75rem 0;
      width: 100%;
    }
  }

  ${Mq.min.md + " and (max-width: 768px)"} {
    padding: 0.5rem 0;
  }
`;

export default function PrimaryLogo({ isOpen, onToggle }) {
  const {
    currentGroup: { name, icon, id, webAddress },
    user: { id: authorId },
    isLoggedIn
  } = useStoreState((s) => s);
  const { pathname } = useRouter();
  const { t } = useTranslation();

  const canEdit = () => adminOrAuthor(authorId) && !pathname.endsWith("edit");

  return (
    <Logo>
      <LocalLink href="/" prefixGroup={true}>
        <Link>
          <img src={`${icon}?w=128`} alt={name} />
          <Text ml={2}>{name}</Text>
        </Link>
      </LocalLink>
      <button className="menu-toggle" onClick={onToggle} aria-label="toggle primary menu">
        <Icon name={isOpen ? "ibpcross" : "ibpmenu"} />
      </button>
      {isLoggedIn && id && <JoinUserGroup />}
      {canEdit() && (
        <LocalLink href={`${webAddress}/edit`}>
          <Button className="join-usergroup" leftIcon="edit" m={2} variantColor="blue" size="sm">
            {t("GROUP.EDIT.TITLE")}
          </Button>
        </LocalLink>
      )}
    </Logo>
  );
}
