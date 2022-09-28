import React, { Suspense } from "react";

import DraftDropzone from "./dropzone";
import { ObservationCreateNextProvider } from "./use-observation-create-next-hook";

const AutoSync = React.lazy(() => import("@components/@core/autosync"));

export default function ObservationCreateNextComponent(props) {
  return (
    <ObservationCreateNextProvider {...props}>
      <DraftDropzone />
      <Suspense fallback={null}>
        <AutoSync />
      </Suspense>
    </ObservationCreateNextProvider>
  );
}
