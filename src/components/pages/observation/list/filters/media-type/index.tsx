import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import { MEDIA_TYPES } from "./filter-keys";

export default function MediaType() {
  return (
    <CheckboxFilterPanel
      translateKey="filters:media."
      filterKey="mediaFilter"
      options={MEDIA_TYPES}
    />
  );
}
