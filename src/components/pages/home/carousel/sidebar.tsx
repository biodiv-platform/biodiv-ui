import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Center, Heading, Link, Text } from "@chakra-ui/react";
import BlurBox from "@components/@core/blur-box";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

export default function Sidebar({ resource }) {
  const { t } = useTranslation();

  const bgThumb = useMemo(
    () =>
      getResourceThumbnail(RESOURCE_CTX.OBSERVATION, resource?.fileName, RESOURCE_SIZE.THUMBNAIL),
    [resource?.fileName]
  );

  return (
    <BlurBox bg={bgThumb} fallbackColor="var(--chakra-colors-gray-800)">
      <Center h="full" p={{ base: 6, lg: 8 }}>
        <div>
          <Heading
            as="h1"
            fontWeight={500}
            mb={2}
            fontSize={{ base: "1.2rem", lg: "2.2rem" }}
            lineHeight="1.3em"
          >
            {resource.title}
          </Heading>
          <Text fontSize={{ md: "sm", lg: "lg" }} mb={4} maxH="14rem" overflow="auto">
            {resource.customDescripition}
          </Text>
          {resource.moreLinks && (
            <Link href={resource.moreLinks}>
              {t("common:read_more")} <ArrowForwardIcon />
            </Link>
          )}
        </div>
      </Center>
    </BlurBox>
  );
}
