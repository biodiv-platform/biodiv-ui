import { DB_CONFIG } from "@static/observation-create";
import React from "react";
import { useFormContext } from "react-hook-form";
import IndexedDBProvider from "use-indexeddb";

import DropzoneField, { IDropzoneProps } from "./field";
import { ObservationCreateProvider } from "./use-observation-resources";

const DropzoneFieldContainer = (props: IDropzoneProps) => {
  const form = useFormContext();

  return (
    <IndexedDBProvider config={DB_CONFIG} loading="Loading...">
      <ObservationCreateProvider
        licensesList={props.licensesList}
        observationAssets={form.control.defaultValuesRef.current[props.name]}
      >
        <DropzoneField {...props} />
      </ObservationCreateProvider>
    </IndexedDBProvider>
  );
};

export default DropzoneFieldContainer;
