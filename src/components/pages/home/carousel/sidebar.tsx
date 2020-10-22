import { Center, Heading, Link, Text } from "@chakra-ui/core";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import BlurBox from "@components/@core/blur-box";
import useTranslation from "@hooks/use-translation";
import { GallerySlider } from "@interfaces/utility";
import { getObservationThumbnail } from "@utils/media";
import React from "react";

interface ISidebarProps {
  featured: GallerySlider[];
  slideIndex;
}

export default function SideBar({ featured, slideIndex }: ISidebarProps) {
  const { t } = useTranslation();
  const { fileName, title, customDescripition, moreLinks } = featured[slideIndex];

  return (
    <BlurBox
      bg={getObservationThumbnail(fileName, 500)}
      fallbackColor="linear-gradient(to bottom, var(--gray-800), var(--gray-900))"
    >
      <Center p={{ base: 4, md: 10 }} h="full">
        <div>
          <Heading as="h1" fontWeight={500} mb={4}>
            {title}
          </Heading>
          <Text fontSize="lg" mb={4} maxH="20rem" overflow="auto">
            {customDescripition}
          </Text>
          {moreLinks && (
            <Link fontSize="xl" href={moreLinks}>
              {t("HOME.BANNER_MORE")} <ArrowForwardIcon />
            </Link>
          )}
        </div>
      </Center>
    </BlurBox>
  );
}
