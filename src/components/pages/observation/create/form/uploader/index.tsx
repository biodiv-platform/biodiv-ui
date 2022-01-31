import { DB_CONFIG } from "@static/observation-create";
import React from "react";
import { useFormContext } from "react-hook-form";
import IndexedDBProvider from "use-indexeddb";

import DropzoneField, { IDropzoneProps } from "./field";
import { ObservationCreateProvider } from "./use-observation-resources";

interface IDropzoneExtendedProps extends IDropzoneProps {
  licensesList;
}

const DropzoneFieldContainer = (props: IDropzoneExtendedProps) => {
  const form = useFormContext();

  return (
    <IndexedDBProvider config={DB_CONFIG} loading="Loading...">
      <ObservationCreateProvider
        licensesList={props.licensesList}
        observationAssets={form.control._defaultValues[props.name]}
      >
        <DropzoneField {...props} />
      </ObservationCreateProvider>
    </IndexedDBProvider>
  );
};

export default DropzoneFieldContainer;
