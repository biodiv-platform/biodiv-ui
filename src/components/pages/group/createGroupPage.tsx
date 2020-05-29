import { isBrowser } from "@static/constants";
import { useStoreState } from "easy-peasy";
import CreateGroupFrom from "./form/speciesCheckBox";
import React, { useEffect } from "react";

function createGroupPage({ speciesGroups, habitats }) {
  const { currentGroup, isLoggedIn } = useStoreState((s) => s);

  const fetchCaches = async () => {
    try {
      const cache = await window.caches.open("v2-light-cache");
      await cache.add(`${currentGroup.webAddress}/group/create`);
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
      <CreateGroupFrom habitats={habitats} speciesGroups={speciesGroups} />
    </div>
  );
}

export default createGroupPage;
