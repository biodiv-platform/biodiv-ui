import React from "react";
import { useFormContext } from "react-hook-form";

import DropzoneField, { IDropzoneProps } from "./field";
import { ObservationCreateProvider } from "./use-observation-resources";

interface IDropzoneExtendedProps extends IDropzoneProps {
  licensesList;
}

const DropzoneFieldContainer = (props: IDropzoneExtendedProps) => {
  const form = useFormContext();

  return (
    <ObservationCreateProvider
      licensesList={props.licensesList}
      observationAssets={form.control._defaultValues[props.name]}
    >
      <DropzoneField {...props} />
    </ObservationCreateProvider>
  );
};

export default DropzoneFieldContainer;
