import React from "react";

import DraftDropzone from "./dropzone";
import { ObservationCreate2Provider } from "./use-observation-create2-hook";

export default function ObservationCreate2Component(props) {
  return (
    <ObservationCreate2Provider {...props}>
      <DraftDropzone />
    </ObservationCreate2Provider>
  );
}
