import { Flex, Spinner } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function ObservationLoading() {
  const { t } = useTranslation();
  return (
    <Flex px={4} mb={4} align="center" justify="center">
      <Spinner mr={2} size="sm" /> {t("LOADING")}
    </Flex>
  );
}
