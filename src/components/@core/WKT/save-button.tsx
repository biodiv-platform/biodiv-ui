import { Button, ButtonProps, Flex } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SaveButton({ onClick, disabled }: ButtonProps) {
  const { t } = useTranslation();

  return (
    <Flex alignItems="flex-end">
      <Button disabled={disabled} type="button" colorPalette="blue" w="full" onClick={onClick}>
        <CheckIcon />
        {t("common:save")}
      </Button>
    </Flex>
  );
}
