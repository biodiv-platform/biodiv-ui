import { Box, List, ListItem } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function SpatialCoverage({ documentCoverage }) {
  const { t } = useTranslation();

  return documentCoverage.length > 0 ? (
    <Box mb={4} className="white-box">
      <BoxHeading>🌎 {t("DOCUMENT.COVERAGE.SPATIAL")}</BoxHeading>
      <List as="ol" styleType="decimal" p={4}>
        {documentCoverage.map(({ placeName, id }) => (
          <ListItem key={id}>{placeName}</ListItem>
        ))}
      </List>
    </Box>
  ) : null;
}
