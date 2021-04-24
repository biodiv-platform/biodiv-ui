import { Box, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { isBrowser } from "@static/constants";
import { preCacheRoutes } from "@utils/auth";
import React, { useEffect } from "react";

export default function DataTableShowPageComponent({ datatableId }) {
  const { currentGroup, isLoggedIn } = useGlobalState();
  const { t } = useTranslation();

  useEffect(() => {
    if (isBrowser) {
      preCacheRoutes(currentGroup);
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <Box className="container mt" pb={6}>
      <PageHeading>ℹ️ {t("DATATABLE.SHOW_PAGE")}</PageHeading>
      <Text>{datatableId}</Text>
    </Box>
  );
}
