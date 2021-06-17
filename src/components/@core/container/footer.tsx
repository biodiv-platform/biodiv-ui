import { Box, Flex, Link, Stack } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import FacebookIcon from "@icons/facebook";
import GithubIcon from "@icons/github";
import MailIcon from "@icons/mail";
import TwitterIcon from "@icons/twitter";
import { APP_VERSION } from "@static/constants";
import useTranslation from "next-translate/useTranslation";
import React from "react";

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
            {t("common:footer.powered_by")}
            <Link href="https://github.com/strandls?q=biodiv">
              Biodiversity Informatics Platform - v{APP_VERSION}
            </Link>
          </div>
        )}
        {SITE_CONFIG.FOOTER.PARTNER && (
          <div>
            {t("common:footer.technology_partner")}
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
