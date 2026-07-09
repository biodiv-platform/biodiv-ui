import { Spinner } from "@chakra-ui/react";
import { lazy, Suspense } from "react";

import TextCurationHeader from "../edit/header";

const TextCurationTable = lazy(() => import("../edit/table/table")); // Lazied to prevent SSR Hydration Error

export default function CurateShowPageComponent() {
  return (
    <div className="container mt">
      <TextCurationHeader />
      <Suspense fallback={<Spinner />}>
        <TextCurationTable />
      </Suspense>
    </div>
  );
}
