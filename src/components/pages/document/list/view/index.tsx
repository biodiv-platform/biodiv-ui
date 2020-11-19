import useObservationFilter from "@components/pages/document/common/use-document-filter";
import React from "react";

import ListView from "./list/list-view";

export default function Views({ no }) {
  const { filter } = useObservationFilter();

  return <>{filter.view === "list" && <ListView no={no} />}</>;
}
