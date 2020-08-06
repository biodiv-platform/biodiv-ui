import { Button, Flex } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function SaveButton({ onClick }) {
  const { t } = useTranslation();

  return (
    <Flex alignItems="flex-end">
      <Button type="button" variantColor="blue" leftIcon="check" w="full" onClick={onClick}>
        {t("SAVE")}
      </Button>
    </Flex>
  );
}
