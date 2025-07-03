import { Box, List } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SpatialCoverage({ documentCoverage }) {
  const { t } = useTranslation();

  return documentCoverage?.length > 0 ? (
    <Box mb={4} className="white-box">
      <BoxHeading>🌎 {t("form:coverage.spatial")}</BoxHeading>
      <Box pl={4}>
        <List.Root p={4} as="ol">
          {documentCoverage.map(({ placeName, id, landscapeIds }) => (
            <List.Item key={id} _marker={{ color: "inherit" }}>
              {landscapeIds ? (
                <BlueLink href={`/landscape/show/${landscapeIds}`}>{placeName}</BlueLink>
              ) : (
                placeName
              )}
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Box>
  ) : null;
}
