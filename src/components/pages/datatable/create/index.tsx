import useGlobalState from "@hooks/use-global-state";
import { isBrowser } from "@static/constants";
import { preCacheRoutes } from "@utils/auth";
import React, { useEffect } from "react";

import DataTableCreateForm from "./form";

export default function DataTableCreatePageComponent() {
  const { currentGroup, isLoggedIn } = useGlobalState();

  useEffect(() => {
    if (isBrowser) {
      preCacheRoutes(currentGroup);
    }
  }, [currentGroup, isLoggedIn]);

  return (
    <div className="container mt">
      <DataTableCreateForm />
    </div>
  );
}
