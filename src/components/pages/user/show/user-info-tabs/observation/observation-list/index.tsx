import { Box } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@hooks/use-translation";
import React from "react";

import ObservationList from "./list";

export default function ObservationListTab({ ud }) {
  const { t } = useTranslation();

  return (
    <Box mb={4} p={4} pb={0} className="white-box">
      <PageHeading size="md">📷 {t("USER.OBSERVATIONS.TITLE")}</PageHeading>
      <ObservationList
        title={t("USER.UPLOADED")}
        data={ud.uploadedObservations}
        loadMore={ud.loadMoreUploadedObservations}
      />
      <ObservationList
        title={t("USER.IDENTIFIED")}
        data={ud.identifiedObservations}
        loadMore={ud.loadMoreIdentifiedObservations}
      />
    </Box>
  );
}
