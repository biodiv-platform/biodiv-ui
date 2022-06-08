import React from "react";

import DraftDropzone from "./dropzone";
import { ObservationCreateNextProvider } from "./use-observation-create-next-hook";

export default function ObservationCreateNextComponent(props) {
  return (
    <ObservationCreateNextProvider {...props}>
      <DraftDropzone />
    </ObservationCreateNextProvider>
  );
}
