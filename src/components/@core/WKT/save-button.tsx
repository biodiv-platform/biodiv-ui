import { Button, Flex } from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import React from "react";

export default function SaveButton({ onClick }) {
  const { t } = useTranslation();

  return (
    <Flex alignItems="flex-end">
      <Button type="button" colorScheme="blue" leftIcon={<CheckIcon />} w="full" onClick={onClick}>
        {t("SAVE")}
      </Button>
    </Flex>
  );
}
