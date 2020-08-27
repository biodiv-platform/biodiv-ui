import useGlobalState from "@hooks/useGlobalState";
import { isBrowser } from "@static/constants";
import { preCacheRoutes } from "@utils/auth";
import React, { useEffect } from "react";

import ObservationCreateForm from "./form";

export default function ObservationCreatePageComponent({
  speciesGroups,
  languages,
  ObservationCreateFormData
}) {
  const { currentGroup, isLoggedIn } = useGlobalState();

  useEffect(() => {
    if (isBrowser) {
      preCacheRoutes(currentGroup);
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <div className="container mt">
      <ObservationCreateForm
        speciesGroups={speciesGroups}
        ObservationCreateFormData={ObservationCreateFormData}
        languages={languages}
      />
    </div>
  );
}
