import AutoSync from "@components/@core/autosync";
import useGlobalState from "@hooks/use-global-state";
import { isBrowser } from "@static/constants";
import { preCacheRoutes } from "@utils/auth";
import React, { useEffect } from "react";

import ObservationCreateForm from "./form";

/**
 * @deprecated this is for old single upload form for new use CreateNext*
 *
 */
export default function ObservationCreateSinglePageComponent({
  speciesGroups,
  languages,
  ObservationCreateFormData,
  licensesList
}) {
  const { currentGroup, isLoggedIn } = useGlobalState();

  useEffect(() => {
    if (isBrowser) {
      preCacheRoutes(currentGroup);
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <div className="container mt">
      <AutoSync />
      <ObservationCreateForm
        speciesGroups={speciesGroups}
        ObservationCreateFormData={ObservationCreateFormData}
        languages={languages}
        licensesList={licensesList}
      />
    </div>
  );
}
