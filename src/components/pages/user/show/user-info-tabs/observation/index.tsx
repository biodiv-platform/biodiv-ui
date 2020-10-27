import useTranslation from "@hooks/use-translation";
import React from "react";

import useUserData from "../../use-user-data";
import ObservationList from "./list";
import UploadedChart from "./uploaded-chart";

export default function ObservationTab({ userId }) {
  const { t } = useTranslation();
  const ud = useUserData(userId);

  return (
    <>
      <ObservationList
        icon={"📷"}
        title={t("USER.OBSERVATIONS.UPLOADED")}
        data={ud.uploadedObservations}
        loadMore={ud.loadMoreUploadedObservations}
      />
      <ObservationList
        icon={"🔍"}
        title={t("USER.OBSERVATIONS.IDENTIFIED")}
        data={ud.identifiedObservations}
        loadMore={ud.loadMoreIdentifiedObservations}
      />
      <UploadedChart data={ud.speciesData} />
    </>
  );
}
