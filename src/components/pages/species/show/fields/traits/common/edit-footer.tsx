import { Button, ButtonGroup } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import React from "react";

export function TraitEditFooter({ onSave, onCancel }) {
  const { t } = useTranslation();

  return (
    <ButtonGroup size="sm" spacing={3}>
      <Button leftIcon={<CheckIcon />} onClick={onSave} colorScheme="blue">
        {t("SAVE")}
      </Button>
      <Button leftIcon={<CrossIcon />} onClick={onCancel}>
        {t("CANCEL")}
      </Button>
    </ButtonGroup>
  );
}
