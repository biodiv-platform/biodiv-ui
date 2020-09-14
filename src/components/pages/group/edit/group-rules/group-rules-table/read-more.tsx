import { Button, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function ReadMore({ value, length = 50 }) {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <span>
      {isOpen ? value : `${value.toString().substring(0, length)}...`}
      <Button onClick={onToggle} size="xs">
        {isOpen ? t("GROUP.RULES.TABLE.READ_LESS") : t("GROUP.RULES.TABLE.READ_MORE")}
      </Button>
    </span>
  );
}
