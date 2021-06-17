import { Box, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function DataTableShowPageComponent({ datatableId }) {
  const { t } = useTranslation();

  return (
    <Box className="container mt" pb={6}>
      <PageHeading>📦 {t("datatable:show_page")}</PageHeading>
      <Text>{datatableId}</Text>
    </Box>
  );
}
