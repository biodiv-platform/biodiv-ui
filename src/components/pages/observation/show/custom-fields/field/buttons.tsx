import { Button, Stack } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import CheckIcon from "@icons/check";
import React from "react";

export default function Buttons({ onSave, onClose }) {
  const { t } = useTranslation();

  return (
    <Stack isInline={true} spacing={2} mt={2}>
      <Button
        size="sm"
        colorScheme="blue"
        aria-label={t("SAVE")}
        type="submit"
        leftIcon={<CheckIcon />}
        onClick={onSave}
      >
        {t("SAVE")}
      </Button>
      <Button size="sm" colorScheme="gray" aria-label={t("CLOSE")} onClick={onClose}>
        {t("CLOSE")}
      </Button>
    </Stack>
  );
}
