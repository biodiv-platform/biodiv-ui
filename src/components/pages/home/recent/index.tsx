import { Box, Flex, Heading, Icon, Link } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import RecentObservationList from "./list";

export default function RecentObservations() {
  const { t } = useTranslation();

  return (
    <Box className="fade" mb={10}>
      <Flex justify="space-between" mb={4}>
        <Heading as="h2" fontSize="2rem">
          {t("HOME.OBSERVATIONS")}
        </Heading>
        <LocalLink href={`/observation/list`} prefixGroup={true}>
          <Link alignSelf="middle" my={3} whiteSpace="nowrap">
            {t("HOME.MORE")} <Icon name="arrow-forward" />
          </Link>
        </LocalLink>
      </Flex>
      <RecentObservationList />
    </Box>
  );
}
