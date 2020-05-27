import { DB_CONFIG } from "@static/observation-create";
import React from "react";
import IndexedDBProvider from "use-indexeddb";

import DropzoneField, { IDropzoneProps } from "./field";
import { ObservationCreateProvider } from "./use-observation-resources";

const DropzoneFieldContainer = (props: IDropzoneProps) => {
  return (
    <IndexedDBProvider config={DB_CONFIG} loading="Loading...">
      <ObservationCreateProvider
        observationAssets={props.form.control.defaultValuesRef.current[props.name]}
      >
        <DropzoneField {...props} />
      </ObservationCreateProvider>
    </IndexedDBProvider>
  );
};

export default DropzoneFieldContainer;
