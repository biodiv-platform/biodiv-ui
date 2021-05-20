import { ObservationCreateProvider } from "@components/pages/observation/create/form/uploader/use-observation-resources";
import { DB_CONFIG } from "@static/observation-create";
import React from "react";
import IndexedDBProvider from "use-indexeddb";
import SpeciesDropzoneField from "./pull-media/dropzone-field";

export default function SpeciesFieldContainer(props) {
  return (
    <IndexedDBProvider config={DB_CONFIG} loading="Loading...">
      <ObservationCreateProvider
        licensesList={props.licensesList}
        observationAssets={props.form.control.defaultValuesRef.current[props.name]}
      >
        <SpeciesDropzoneField {...props} />
      </ObservationCreateProvider>
    </IndexedDBProvider>
  );
}
