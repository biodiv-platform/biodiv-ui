import { isBrowser } from "@static/constants";
import { useStoreState } from "easy-peasy";
import React, { useEffect } from "react";

import ObservationCreateForm from "./form";

export default function ObservationCreatePageComponent({ speciesGroups, languages }) {
  const { currentGroup, isLoggedIn } = useStoreState((s) => s);

  const fetchCaches = async () => {
    try {
      const cache = await window.caches.open("v2-light-cache");
      await cache.add(`${currentGroup.webAddress}/observation/create`);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isBrowser) {
      fetchCaches();
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <div className="container mt">
      <ObservationCreateForm speciesGroups={speciesGroups} languages={languages} />
    </div>
  );
}
