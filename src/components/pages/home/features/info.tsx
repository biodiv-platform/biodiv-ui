import { Box, Flex, Link, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function Info({ icon: Icon, title, link }) {
  const { t } = useTranslation();

  return (
    <Flex align="flex-start" direction={["column", "row"]}>
      <Box w={90} mr={5} mb={8}>
        <LocalLink href={link} prefixGroup={true}>
          <Link aria-label={title} display="inline-block">
            <Icon s={90} />
          </Link>
        </LocalLink>
      </Box>
      <Box flexGrow={1}>
        <Text as="h2" lineHeight={1} mb={3} fontSize="2xl">
          {t(`HOME.FEATURES.${title}.TITLE`)}
        </Text>
        <Text color="gray.600" fontSize="lg">
          {t(`HOME.FEATURES.${title}.DESC`)}
        </Text>
      </Box>
    </Flex>
  );
}
