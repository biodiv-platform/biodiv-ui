import { Box, Flex, Icon, Link, Stack } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import { version } from "../../../../package.json";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box py={8} bg="gray.200" color="gray.600" className="footer">
      <Flex textAlign="center" direction="column" align="center" className="container">
        <div>
          {t("FOOTER.POWERED_BY")}
          <Link href="https://github.com/strandls?q=biodiv">
            Biodiversity Informatics Platform - v{version}
          </Link>
          <br />
          {t("FOOTER.TECHNOLOGY_PARTNER")}
          <Link href="https://strandls.com/">Strand Life Sciences</Link>
        </div>
        <Stack isInline={true} spacing={4} mt={2} fontSize="1.4rem">
          <Link aria-label={t("FOOTER.EMAIL")} href="mailto:support@indiabiodiversity.org">
            <Icon name="ibpmail" />
          </Link>
          <Link aria-label={t("FOOTER.FACEBOOK")} href="https://www.facebook.com/indiabiodiversity">
            <Icon name="ibpfacebook" />
          </Link>
          <Link aria-label={t("FOOTER.TWITTER")} href="https://twitter.com/inbiodiversity">
            <Icon name="ibptwitter" />
          </Link>
          <Link aria-label={t("FOOTER.GITHUB")} href="https://github.com/strandls?q=biodiv">
            <Icon name="ibpgithub" />
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
}
