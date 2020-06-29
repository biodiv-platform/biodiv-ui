import { Box, Flex } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import React from "react";
import NotificationsForm from "./form";
import useTranslation from "@configs/i18n/useTranslation";

function NotificationComponent() {
  const { t } = useTranslation();
  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xs" width="full" pb={4}>
        <PageHeading>{t("APP_ADMIN.PAGES.NOTIFICATION.HEADING")}</PageHeading>
        <NotificationsForm />
      </Box>
    </Flex>
  );
}

export default NotificationComponent;
