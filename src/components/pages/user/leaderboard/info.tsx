import { Alert, AlertIcon, CloseButton, useDisclosure } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function InfoMessage() {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { t } = useTranslation();

  return (
    <Alert status="info" variant="left-accent" mb={4} display={["none", "block"]} hidden={!isOpen}>
      <AlertIcon />
      {t("leaderboard:tip")}
      <CloseButton onClick={onClose} position="absolute" right="8px" top="8px" />
    </Alert>
  );
}
