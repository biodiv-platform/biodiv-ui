import { Box, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function DataTableShowPageComponent({ datatableId }) {
  const { t } = useTranslation();

  return (
    <Box className="container mt" pb={6}>
      <PageHeading>📦 {t("DATATABLE.SHOW_PAGE")}</PageHeading>
      <Text>{datatableId}</Text>
    </Box>
  );
}
