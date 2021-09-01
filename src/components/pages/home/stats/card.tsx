import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import styled from "@emotion/styled";
import { toHumanString } from "human-readable-numbers";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const CardLink = styled.a`
  div {
    border: 2px solid var(--chakra-colors-gray-200);
    transition: 0.2s ease-in-out;
    .arrow {
      transition: 0.1s ease-in-out;
      opacity: 0;
    }
    :hover .arrow {
      opacity: 1;
      margin-left: 0.25rem;
    }
    .count {
      font-size: 1.6rem;
    }
    @media (max-width: 1024px) {
      .count {
        font-size: 1.25rem;
      }
      .arrow {
        display: none;
      }
    }
  }
`;

export default function Card({ name, count, index, meta }) {
  const { t } = useTranslation();
  const { icon: IconMain, link, color } = meta;

  return (
    <LocalLink href={link} prefixGroup={true}>
      <CardLink>
        <Box
          p={4}
          className={`fadeInUp delay-${index + 1}`}
          bg="white"
          borderRadius="lg"
          _hover={{ borderColor: color }}
        >
          <IconMain s={70} />
          <Text className="count" fontSize="3xl" mt={2}>
            {toHumanString(count || 0)}
          </Text>
          <Text>
            {t(`home:portal_stats.${name.toLowerCase()}`)}
            <span className="arrow">
              <ArrowForwardIcon />
            </span>
          </Text>
        </Box>
      </CardLink>
    </LocalLink>
  );
}
