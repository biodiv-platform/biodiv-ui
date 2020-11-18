import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
import React from "react";

import ObservationList from "./list";

export default function ObservationListTab({ ud }) {
  const { t } = useTranslation();

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📷 {t("USER.OBSERVATIONS.TITLE")}</BoxHeading>
      <Box p={4} pb={0}>
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
    </Box>
  );
}
