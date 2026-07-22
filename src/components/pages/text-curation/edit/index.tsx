import { Spinner } from "@chakra-ui/react";
import { lazy, Suspense } from "react";

import TextCurationHeader from "./header";

const TextCurationTable = lazy(() => import("./table/table")); // Lazied to prevent SSR Hydration Error

export default function CurateEditPageComponent() {
  return (
    <div className="container mt">
      <TextCurationHeader />
      <Suspense fallback={<Spinner />}>
        <TextCurationTable />
      </Suspense>
    </div>
  );
}
