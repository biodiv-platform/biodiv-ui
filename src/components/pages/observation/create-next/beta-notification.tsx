import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Badge } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import SITE_CONFIG from "@configs/site-config";
import React from "react";

export default function BetaNotification() {
  return (
    <Alert status="info">
      <AlertIcon />
      Welcome to Multiple Observation Upload
      <Badge ml={1} px={2} py={1} borderRadius="lg" colorScheme="blue" variant="solid">
        BETA
      </Badge>
      <ExternalBlueLink ml={4} isExternal={true} href={SITE_CONFIG.FEEDBACK.URL}>
        Feedback <ExternalLinkIcon />
      </ExternalBlueLink>
    </Alert>
  );
}
