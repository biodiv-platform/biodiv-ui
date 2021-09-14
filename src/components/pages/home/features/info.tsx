import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { getLocalIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Info({ icon, title, link }) {
  const { t } = useTranslation();

  const iconPath = getLocalIcon(icon, "icons");

  return (
    <Flex align="flex-start" direction={["column", "row"]}>
      <Box w={90} mr={5} mb={8}>
        <LocalLink href={link} prefixGroup={true}>
          <Link aria-label={title} display="inline-block">
            <Image src={iconPath} alt={icon} minW={90} display="inline-block" />
          </Link>
        </LocalLink>
      </Box>
      <Box flexGrow={1}>
        <Text as="h2" lineHeight={1} mb={3} fontSize="2xl">
          {t(`home:features.${title}.title`)}
        </Text>
        <Text color="gray.600" fontSize="lg">
          {t(`home:features.${title}.desc`)}
        </Text>
      </Box>
    </Flex>
  );
}
