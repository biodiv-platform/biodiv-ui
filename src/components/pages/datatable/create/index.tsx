import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { isBrowser } from "@static/constants";
import { preCacheRoutes } from "@utils/auth";
import React, { useEffect } from "react";

import DataTableCreateForm from "./form";

export default function DataTableCreatePageComponent({ speciesGroups, languages }) {
  const { currentGroup, isLoggedIn } = useGlobalState();
  const { t } = useTranslation();

  useEffect(() => {
    if (isBrowser) {
      preCacheRoutes(currentGroup);
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <Box className="container mt" pb={6}>
      <PageHeading>📄 {t("DOCUMENT.CREATE.TITLE")}</PageHeading>
      <DataTableCreateForm speciesGroups={speciesGroups} languages={languages} />
    </Box>
  );
}
