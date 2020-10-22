import useTranslation from "@hooks/use-translation";
import React from "react";

import useUserData from "../../use-user-data";
import ObservationList from "./list";

export default function ObservationTab({ userId }) {
  const { t } = useTranslation();
  const {
    identifiedObservations,
    loadMoreIdentifiedObservations,
    uploadedObservations,
    loadMoreUploadedObservations
  } = useUserData(userId);

  return (
    <>
      <ObservationList
        icon={"📷"}
        title={t("USER.OBSERVATIONS.UPLOADED")}
        data={uploadedObservations}
        loadMore={loadMoreUploadedObservations}
      />
      <ObservationList
        icon={"🔍"}
        title={t("USER.OBSERVATIONS.IDENTIFIED")}
        data={identifiedObservations}
        loadMore={loadMoreIdentifiedObservations}
      />
    </>
  );
}
