import { Button, ButtonGroup } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export function TraitEditFooter({ onSave, onCancel }) {
  const { t } = useTranslation();

  return (
    <ButtonGroup size="sm" gap={3}>
      <Button onClick={onSave} colorPalette="blue">
        <CheckIcon />
        {t("common:save")}
      </Button>
      <Button onClick={onCancel}>
        <CrossIcon />
        {t("common:cancel")}
      </Button>
    </ButtonGroup>
  );
}
