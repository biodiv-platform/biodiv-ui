import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useGlobalState from "@hooks/use-global-state";
import { isBrowser } from "@static/constants";
import { preCacheRoutes } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";

import DataTableCreateForm from "./form";

export default function DataTableCreatePageComponent({ speciesGroups, languages, datasetId }) {
  const { currentGroup, isLoggedIn } = useGlobalState();
  const { t } = useTranslation();

  useEffect(() => {
    if (isBrowser) {
      preCacheRoutes(currentGroup);
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <Box className="container mt" pb={6}>
      <PageHeading mb={6}>📦 {t("datatable:create_datatable")}</PageHeading>
      <DataTableCreateForm
        speciesGroups={speciesGroups}
        languages={languages}
        datasetId={datasetId}
      />
    </Box>
  );
}
