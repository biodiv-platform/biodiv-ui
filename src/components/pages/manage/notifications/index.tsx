import { Box, Flex } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import NotificationsForm from "./form";

function NotificationComponent() {
  const { t } = useTranslation();

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xs" width="full" pb={4}>
        <PageHeading>🔔 {t("admin:pages.notification.heading")}</PageHeading>
        <NotificationsForm />
      </Box>
    </Flex>
  );
}

export default NotificationComponent;
