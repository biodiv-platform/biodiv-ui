import { Alert, AlertIcon, CloseButton, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function InfoMessage() {
  const { isOpen, onClose } = useDisclosure({ isOpen: true });
  const { t } = useTranslation();

  return (
    <Alert status="info" variant="left-accent" mb={4} display={["none", "block"]} hidden={!isOpen}>
      <AlertIcon />
      {t("LEADERBOARD.TIP")}
      <CloseButton onClick={onClose} position="absolute" right="8px" top="8px" />
    </Alert>
  );
}
