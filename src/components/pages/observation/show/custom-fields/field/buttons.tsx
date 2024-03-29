import { Button, Stack } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Buttons({ onSave, onClose }) {
  const { t } = useTranslation();

  return (
    <Stack isInline={true} spacing={2} mt={2}>
      <Button
        size="sm"
        colorScheme="blue"
        aria-label={t("common:save")}
        type="submit"
        leftIcon={<CheckIcon />}
        onClick={onSave}
      >
        {t("common:save")}
      </Button>
      <Button size="sm" colorScheme="gray" aria-label={t("common:close")} onClick={onClose}>
        {t("common:close")}
      </Button>
    </Stack>
  );
}
