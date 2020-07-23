import { Box, Flex } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";
import NotificationsForm from "./form";

function NotificationComponent() {
  const { t } = useTranslation();

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xs" width="full" pb={4}>
        <PageHeading>🔔 {t("ADMIN.PAGES.NOTIFICATION.HEADING")}</PageHeading>
        <NotificationsForm />
      </Box>
    </Flex>
  );
}

export default NotificationComponent;
