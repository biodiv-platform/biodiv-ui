import { Box } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import React from "react";

export default function ContactAdmin() {
  const { t } = useTranslation();

  return (
    <Box mb={4}>
      <BlueLink href={SITE_CONFIG.FOOTER.SOCIAL.MAIL.URL} isExternal={true}>
        {t("GROUP.ADMIN.NO_ACCESS")}
      </BlueLink>
    </Box>
  );
}
