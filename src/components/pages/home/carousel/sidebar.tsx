import { Flex, Heading, Icon, Link, Text } from "@chakra-ui/core";
import BlurBox from "@components/@core/blur-box";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import { getObservationThumbnail } from "@utils/media";
import React from "react";

export default function SideBar({ bg }) {
  const { t } = useTranslation();

  return (
    <BlurBox
      bg={getObservationThumbnail(bg, 500)}
      fallbackColor="linear-gradient(to bottom, var(--gray-700), var(--gray-800))"
    >
      <Flex p={10} className="content" h="full" justify="center" direction="column">
        <Heading as="h1" fontWeight="100" mb={4}>
          {t("HOME.BANNER_TITLE")}
        </Heading>
        <Text fontSize="lg" mb={4}>
          {t("HOME.BANNER_DESCRIPTION")}
        </Text>
        <LocalLink href="/about" prefixGroup={true}>
          <Link fontSize="xl">
            {t("HOME.BANNER_MORE")} <Icon name="arrow-forward" />
          </Link>
        </LocalLink>
      </Flex>
    </BlurBox>
  );
}
