import { Button, ButtonGroup } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export function TraitEditFooter({ onSave, onCancel }) {
  const { t } = useTranslation();

  return (
    <ButtonGroup size="sm" spacing={3}>
      <Button leftIcon={<CheckIcon />} onClick={onSave} colorPalette="blue">
        {t("common:save")}
      </Button>
      <Button leftIcon={<CrossIcon />} onClick={onCancel}>
        {t("common:cancel")}
      </Button>
    </ButtonGroup>
  );
}
