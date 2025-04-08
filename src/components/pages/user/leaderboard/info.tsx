import { CloseButton, useDisclosure } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Alert } from "@/components/ui/alert";

export default function InfoMessage() {
  const { open, onClose } = useDisclosure({ defaultOpen: true });
  const { t } = useTranslation();

  return (
    //  variant="left-accent"
    <Alert status="info" mb={4} display={["none", "flex"]} hidden={!open}>
      {t("leaderboard:tip")}
      <CloseButton onClick={onClose} position="absolute" right="8px" top="8px" />
    </Alert>
  );
}
