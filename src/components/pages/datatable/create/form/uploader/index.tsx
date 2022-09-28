import { ObservationCreateProvider } from "@components/pages/observation/create/form/uploader/use-observation-resources";
import React from "react";
import { useFormContext } from "react-hook-form";

import DropzoneField, { IDropzoneProps } from "./field";

const DropzoneFieldContainer = (props: IDropzoneProps) => {
  const form = useFormContext();

  return (
    <ObservationCreateProvider observationAssets={form.control._defaultValues[props.name]}>
      <DropzoneField {...props} />
    </ObservationCreateProvider>
  );
};

export default DropzoneFieldContainer;
