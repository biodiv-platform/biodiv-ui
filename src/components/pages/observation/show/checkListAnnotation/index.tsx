import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { ResponsiveInfo } from "../info/responsive-info";

export default function CheckListAnnotation({ customData }) {
  const { t } = useTranslation();

  return (
    <Box p={4} mb={4} className="white-box">
      <BoxHeading>📚 {t("observation:checklistAnnotation")}</BoxHeading>
      <SimpleGrid columns={[1, 1, 5, 5]} spacing={2}>
        {Object.keys(customData).map(
          (key, index) =>
            customData[key] && (
              <ResponsiveInfo key={index} title={key}>
                <Stack isInline={true}>
                  <Text mr={1}>{`${customData[key]}`}</Text>
                </Stack>
              </ResponsiveInfo>
            )
        )}
      </SimpleGrid>
    </Box>
  );
}
