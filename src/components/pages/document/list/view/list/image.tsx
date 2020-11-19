import { Avatar, Flex, Link, Text } from "@chakra-ui/react";
import FlagActionButton from "@components/@core/action-buttons/flag";
import LocalLink from "@components/@core/local-link";
import styled from "@emotion/styled";
import { axFlagDocument, axUnFlagDocument } from "@services/document.service";
import { Mq } from "mq-styled-components";
import React from "react";

const ImageBox = styled.div`
  position: relative;
  height: auto;
  border-right: 1px solid var(--gray-300);
  flex-shrink: 0;

  .ob-image-list {
    width: 18rem;
    height: 18rem;
  }

  .stats {
    position: absolute;
    top: 0;
    left: 0;

    margin: 1rem;
    padding: 0.1rem 0.6rem;

    user-select: none;

    border-radius: 1rem;
    background: white;
    box-shadow: var(--subtle-shadow);

    svg {
      display: inline-block;

      margin-top: 0.25rem;
      margin-right: 0.7rem;

      vertical-align: top;

      &:last-child {
        margin-right: 0.25rem;
      }
    }
  }

  @media (max-width: 767px) {
    border-right: 0;
    .ob-image-list {
      width: 100%;
    }
  }

  ${Mq.min.md + " and (max-width: 1024px)"} {
    .ob-image-list {
      width: 14rem;
    }
  }
`;

export default function ImageBoxComponent({ document, user, flags }) {
  return (
    <ImageBox>
      <FlagActionButton
        resourceId={document.id}
        resourceType="document"
        initialFlags={flags}
        userId={user.id}
        flagFunc={axFlagDocument}
        unFlagFunc={axUnFlagDocument}
      />
      <Flex alignItems="center" justifyContent="center" w="15rem">
        <LocalLink href={`/document/show/${document.id}`} prefixGroup={true}>
          <Link color="white">
            <Text title={document.item_type || "image type"}>
              <Avatar size="2xl" name={document.item_type} />
            </Text>
          </Link>
        </LocalLink>
      </Flex>
    </ImageBox>
  );
}
