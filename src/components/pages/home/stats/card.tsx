import { Box, Icon, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { toHumanString } from "human-readable-numbers";
import React from "react";

export default function Card({ name, count, index, meta }) {
  const { t } = useTranslation();
  const { icon: IconMain, link, color } = meta;

  const CardLink = styled.a`
    div {
      border: 2px solid var(--gray-200);
      transition: 0.2s ease-in-out;
      .arrow {
        transition: 0.1s ease-in-out;
        opacity: 0;
      }
      :hover {
        border-color: ${color};
        .arrow {
          opacity: 1;
          margin-left: 0.25rem;
        }
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

  return (
    <LocalLink href={link} prefixGroup={true}>
      <CardLink>
        <Box p={4} className={`fadeInUp delay-${index + 1}`} bg="white" borderRadius="lg">
          <IconMain s={70} />
          <Text className="count" fontSize="3xl" mt={2}>
            {toHumanString(count)}
          </Text>
          <Text>
            {t(`HOME.PORTAL_STATS.${name.toUpperCase()}`)}
            <span className="arrow">
              <Icon name="arrow-forward" />
            </span>
          </Text>
        </Box>
      </CardLink>
    </LocalLink>
  );
}
