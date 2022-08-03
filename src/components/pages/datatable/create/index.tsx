import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import DataTableCreateForm from "./form";

export default function DataTableCreatePageComponent(props) {
  const { t } = useTranslation();

  return (
    <Box className="container mt" pb={6}>
      <PageHeading mb={6}>📦 {t("datatable:create_datatable")}</PageHeading>
      <DataTableCreateForm {...props} />
    </Box>
  );
}
