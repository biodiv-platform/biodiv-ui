import { Box } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import useTranslation from "@hooks/use-translation";
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
