import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { FEATURES } from "@static/home";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import Info from "./info";

export default function Features() {
  const { t } = useTranslation();

  return (
    <Box mb={10}>
      <Heading as="h2" mb={6} fontSize="2rem">
        {t("home:features.title")}
      </Heading>
      <SimpleGrid columns={[1, 1, 1, 2]} gap={6}>
        {FEATURES.filter((o) => o.tag.includes(SITE_CONFIG.HOME.FEATURES)).map(
          ({ icon, title, link }) => (
            <Info key={title} icon={icon} title={title} link={link} />
          )
        )}
      </SimpleGrid>
    </Box>
  );
}
