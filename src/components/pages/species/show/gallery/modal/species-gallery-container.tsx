import { ObservationCreateProvider } from "@components/pages/observation/create/form/uploader/use-observation-resources";
import React from "react";

import SpeciesDropzoneField from "./pull-media/dropzone-field";

export default function SpeciesFieldContainer(props) {
  return (
    <ObservationCreateProvider
      licensesList={props.licensesList}
      observationAssets={props.form.control._defaultValues[props.name]}
    >
      <SpeciesDropzoneField {...props} />
    </ObservationCreateProvider>
  );
}
