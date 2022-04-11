import { Spinner } from "@chakra-ui/react";
import React, { Suspense } from "react";

import CurationEditModal from "./editor";
import TextCurationHeader from "./header";

const TextCurationTable = React.lazy(() => import("./table/table")); // Lazied to prevent SSR Hydration Error

export default function CurateEditPageComponent() {
  return (
    <div className="container mt">
      <TextCurationHeader />
      <Suspense fallback={<Spinner />}>
        <TextCurationTable />
      </Suspense>
      <CurationEditModal />
    </div>
  );
}
