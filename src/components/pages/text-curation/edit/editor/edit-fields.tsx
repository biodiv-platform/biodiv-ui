import React from "react";

import useCurateEdit from "../use-curate-edit";
import EditDate from "./edit-date";
import EditLocation from "./edit-location";
import EditScientificName from "./edit-scientific-name";

export default function EditFields() {
  const { rows } = useCurateEdit();

  switch (rows.editing.name) {
    case "curatedSName":
      return <EditScientificName />;

    case "curatedLocation":
      return <EditLocation />;

    case "curatedDate":
      return <EditDate />;

    default:
      return null;
  }
}
