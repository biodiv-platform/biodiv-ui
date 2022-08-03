import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Badge } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function BetaNotification() {
  const { t } = useTranslation();

  return (
    <Alert status="info">
      <AlertIcon />
      {t("observation:upload_info")}
      <Badge ml={1} px={2} py={1} borderRadius="lg" colorScheme="blue" variant="solid">
        BETA
      </Badge>
      <ExternalBlueLink ml={4} isExternal={true} href={SITE_CONFIG.FEEDBACK.URL}>
        {t("common:feedback")} <ExternalLinkIcon />
      </ExternalBlueLink>
    </Alert>
  );
}
