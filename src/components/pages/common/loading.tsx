import { Flex, Spinner } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Loading() {
  const { t } = useTranslation();
  return (
    <Flex px={4} mb={4} align="center" justify="center">
      <Spinner mr={2} size="sm" /> {t("common:loading")}
    </Flex>
  );
}
