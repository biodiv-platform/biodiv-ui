import { Center, Heading, Link, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import BlurBox from "@components/@core/blur-box";
import useTranslation from "@hooks/use-translation";
import { RESOURCE_SIZE } from "@static/constants";
import { getObservationImage } from "@utils/media";
import React from "react";

export default function Sidebar({ resource }) {
  const { t } = useTranslation();

  return (
    <BlurBox
      bg={getObservationImage(resource?.fileName, RESOURCE_SIZE.PREVIEW)}
      fallbackColor="var(--gray-800)"
    >
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
              {t("HOME.BANNER_MORE")} <ArrowForwardIcon />
            </Link>
          )}
        </div>
      </Center>
    </BlurBox>
  );
}
