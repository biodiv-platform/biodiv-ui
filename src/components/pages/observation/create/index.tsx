import { isBrowser } from "@static/constants";
import { useStoreState } from "easy-peasy";
import React, { useEffect } from "react";

import ObservationCreateForm from "./form";
import { preCacheRoutes } from "@utils/auth";

export default function ObservationCreatePageComponent({ speciesGroups, languages }) {
  const { currentGroup, isLoggedIn } = useStoreState((s) => s);

  useEffect(() => {
    if (isBrowser) {
      preCacheRoutes(currentGroup);
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <div className="container mt">
      <ObservationCreateForm speciesGroups={speciesGroups} languages={languages} />
    </div>
  );
}
