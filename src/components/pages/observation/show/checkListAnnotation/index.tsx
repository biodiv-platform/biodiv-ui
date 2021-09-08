import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { ResponsiveInfo } from "../info/responsive-info";

export default function CheckListAnnotation({ customData }) {
  const { t } = useTranslation();

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📚 {t("observation:checklist_annotation")}</BoxHeading>
      <SimpleGrid columns={[1, 1, 5, 5]} spacing={2} p={4}>
        {Object.keys(customData).map(
          (key, index) =>
            customData[key] && (
              <ResponsiveInfo key={index} title={key}>
                <Stack ml={4} isInline={true}>
                  <Text>{`${customData[key]}`}</Text>
                </Stack>
              </ResponsiveInfo>
            )
        )}
      </SimpleGrid>
    </Box>
  );
}
