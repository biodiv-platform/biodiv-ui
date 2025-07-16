import { Box, chakra, Container, Link, SimpleGrid, Stack } from "@chakra-ui/react";
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
  FACEBOOK: <FacebookIcon size={"sm"} />,
  GITHUB: <GithubIcon size={"sm"} />,
  MAIL: <MailIcon size={"sm"} />,
  TWITTER: <TwitterIcon size={"sm"} />
};

export default function Footer() {
  const { t } = useTranslation();
  const { pages } = useGlobalState();

  return (
    <Box bg="gray.100" color="gray.700" className="no-print">
      <Container as={Stack} maxW={containerMaxW} py={10}>
        <SimpleGrid templateColumns={{ md: "4fr 4fr" }} gap={8}>
          <Stack gap={4}>
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
            <Stack direction="row" gap={6}>
              {Object.entries(SITE_CONFIG.FOOTER.SOCIAL).map(([icon, { LABEL, URL }]) => (
                <Link aria-label={t(LABEL)} title={t(LABEL)} href={URL} key={icon}>
                  <chakra.button
                    bg="blackAlpha.100"
                    rounded="full"
                    w={8}
                    h={8}
                    cursor="pointer"
                    as="a"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="background 0.3s ease"
                    _hover={{ bg: "blackAlpha.200" }}
                    rel="noreferrer noopener"
                  >
                    {ICONS[icon]}
                  </chakra.button>
                </Link>
              ))}
              {SITE_CONFIG.FEEDBACK.ACTIVE && (
                <Link
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
            <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
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
