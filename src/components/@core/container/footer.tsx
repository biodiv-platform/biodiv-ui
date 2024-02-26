import { Box, Container, Link, SimpleGrid, Stack } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import FacebookIcon from "@icons/facebook";
import FeedbackIcon from "@icons/feedback";
import GithubIcon from "@icons/github";
import MailIcon from "@icons/mail";
import TwitterIcon from "@icons/twitter";
import { APP_VERSION } from "@static/constants";
import { containerMaxW } from "@static/home";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import LocalLink from "../local-link";

const ICONS = {
  FACEBOOK: <FacebookIcon />,
  GITHUB: <GithubIcon />,
  MAIL: <MailIcon />,
  TWITTER: <TwitterIcon />
};

export default function Footer() {
  const { t } = useTranslation();
  const { pages } = useGlobalState();

  return (
    <Box bg="gray.100" color="gray.700" className="no-print">
      <Container as={Stack} maxW={containerMaxW} py={10}>
        <SimpleGrid templateColumns={{ md: "4fr 2fr" }} spacing={8}>
          <Stack spacing={4}>
            <Box>
              {t("common:footer.powered_by")}
              <Link ml={1} href="https://github.com/biodiv-platform">
                Biodiversity Informatics Platform - v{APP_VERSION}
              </Link>
            </Box>
            {SITE_CONFIG.FOOTER.PARTNER && (
              <div>
                {t("common:footer.technology_partner")}
                <Link ml={1} href="https://strandls.com/">
                  Strand Life Sciences
                </Link>
              </div>
            )}
            <Stack direction="row" spacing={6}>
              {Object.entries(SITE_CONFIG.FOOTER.SOCIAL).map(([icon, { LABEL, URL }]) => (
                <Link
                  aria-label={t(LABEL)}
                  title={t(LABEL)}
                  href={URL}
                  key={icon}
                  isExternal={true}
                >
                  {ICONS[icon]}
                </Link>
              ))}
              {SITE_CONFIG.FEEDBACK.ACTIVE && (
                <Link
                  isExternal={true}
                  aria-label={t("common:feedback")}
                  title={t("common:feedback")}
                  href={SITE_CONFIG.FEEDBACK.URL}
                >
                  <FeedbackIcon />
                </Link>
              )}
            </Stack>
          </Stack>
          <div>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {pages
                .flatMap((page) => [page, ...page.children])
                .filter((page) => page.showInFooter !== false)
                .map((page) => (
                  <LocalLink href={`/page/show/${page.id}`} key={page.id} prefixGroup={true}>
                    <Link>{page.title}</Link>
                  </LocalLink>
                ))}
            </SimpleGrid>
          </div>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
