import { Button, ButtonProps, Flex } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SaveButton({ onClick, isDisabled }: ButtonProps) {
  const { t } = useTranslation();

  return (
    <Flex alignItems="flex-end">
      <Button
        isDisabled={isDisabled}
        type="button"
        colorScheme="blue"
        leftIcon={<CheckIcon />}
        w="full"
        onClick={onClick}
      >
        {t("common:save")}
      </Button>
    </Flex>
  );
}
