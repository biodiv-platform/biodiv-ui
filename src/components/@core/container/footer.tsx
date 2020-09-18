import { Box, Flex, Link, Stack } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import FacebookIcon from "@icons/facebook";
import GithubIcon from "@icons/github";
import MailIcon from "@icons/mail";
import TwitterIcon from "@icons/twitter";
import React from "react";

import { version } from "../../../../package.json";

const ICONS = {
  FACEBOOK: <FacebookIcon />,
  GITHUB: <GithubIcon />,
  MAIL: <MailIcon />,
  TWITTER: <TwitterIcon />
};

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box py={8} bg="gray.200" color="gray.600" className="footer">
      <Flex textAlign="center" direction="column" align="center" className="container">
        {SITE_CONFIG.FOOTER.CREDITS && (
          <div>
            {t("FOOTER.POWERED_BY")}
            <Link href="https://github.com/strandls?q=biodiv">
              Biodiversity Informatics Platform - v{version}
            </Link>
          </div>
        )}
        {SITE_CONFIG.FOOTER.PARTNER && (
          <div>
            {t("FOOTER.TECHNOLOGY_PARTNER")}
            <Link href="https://strandls.com/">Strand Life Sciences</Link>
          </div>
        )}
        <Stack isInline={true} spacing={4} mt={2} fontSize="1.4rem">
          {Object.entries(SITE_CONFIG.FOOTER.SOCIAL).map(([icon, { LABEL, URL }]) => (
            <Link aria-label={t(LABEL)} href={URL} key={icon}>
              {ICONS[icon]}
            </Link>
          ))}
        </Stack>
      </Flex>
    </Box>
  );
}
