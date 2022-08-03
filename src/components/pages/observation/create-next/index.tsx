import React, { Suspense } from "react";

import BetaNotification from "./beta-notification";
import DraftDropzone from "./dropzone";
import { ObservationCreateNextProvider } from "./use-observation-create-next-hook";

const AutoSync = React.lazy(() => import("@components/@core/autosync"));

export default function ObservationCreateNextComponent(props) {
  return (
    <ObservationCreateNextProvider {...props}>
      <BetaNotification />
      <DraftDropzone />
      <Suspense fallback={null}>
        <AutoSync />
      </Suspense>
    </ObservationCreateNextProvider>
  );
}
