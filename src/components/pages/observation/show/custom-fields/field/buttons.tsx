import { Button, Stack } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function Buttons({ onSave, onClose }) {
  const { t } = useTranslation();

  return (
    <Stack isInline={true} spacing={2} mt={2}>
      <Button
        size="sm"
        variantColor="blue"
        aria-label={t("SAVE")}
        type="submit"
        leftIcon={"ibpcheck" as any}
        onClick={onSave}
      >
        {t("SAVE")}
      </Button>
      <Button size="sm" variantColor="gray" aria-label={t("CLOSE")} onClick={onClose}>
        {t("CLOSE")}
      </Button>
    </Stack>
  );
}
