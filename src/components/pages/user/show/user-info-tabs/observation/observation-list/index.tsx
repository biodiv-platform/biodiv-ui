import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";

import ObservationList from "./list";

export default function ObservationListTab({ ud }) {
  const { t } = useTranslation();

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📷 {t("user:observations.title")}</BoxHeading>
      <Box p={4} pb={0}>
        <ObservationList
          title={t("user:uploaded")}
          data={ud.uploadedObservations}
          loadMore={ud.loadMoreUploadedObservations}
        />
        <ObservationList
          title={t("user:identified")}
          data={ud.identifiedObservations}
          loadMore={ud.loadMoreIdentifiedObservations}
        />
      </Box>
    </Box>
  );
}
