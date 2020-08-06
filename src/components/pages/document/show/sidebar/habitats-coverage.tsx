import { AspectRatioBox, Box, Image, SimpleGrid } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function HabitatsCoverage({ habitat }) {
  const { t } = useTranslation();

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>🏜 {t("GROUP.HABITATS_COVERED")}</BoxHeading>
      <SimpleGrid columns={4} spacing={4} p={4}>
        {habitat.map((id) => (
          <AspectRatioBox ratio={1}>
            <Image
              overflow="hidden"
              objectFit="cover"
              alt={id}
              src={id}
              bg="gray.200"
              borderRadius="md"
            />
          </AspectRatioBox>
        ))}
      </SimpleGrid>
    </Box>
  );
}
