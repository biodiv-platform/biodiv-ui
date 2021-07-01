import { Box, ListItem, OrderedList } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SpatialCoverage({ documentCoverage }) {
  const { t } = useTranslation();

  return documentCoverage?.length > 0 ? (
    <Box mb={4} className="white-box">
      <BoxHeading>🌎 {t("form:coverage.spatial")}</BoxHeading>
      <OrderedList p={4}>
        {documentCoverage.map(({ placeName, id, landscapeIds }) => (
          <ListItem key={id}>
            {landscapeIds ? (
              <BlueLink href={`/landscape/show/${landscapeIds}`}>{placeName}</BlueLink>
            ) : (
              placeName
            )}
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  ) : null;
}
