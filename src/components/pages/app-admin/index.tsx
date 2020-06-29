import { Box } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

function AdminComponent() {
  const { t } = useTranslation();
  return (
    <Box className="container fadeInUp" pt={6}>
      <BlueLink href="/app-admin/notifications" display="block">
        {t("APP_ADMIN.LINKS.NOTIFICATION")}
      </BlueLink>
    </Box>
  );
}

export default AdminComponent;
