import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import DropTarget from "./drop-target";

interface IDropzoneProps {
  name: string;
  label: string;
  setFieldMapping: any;
  setShowMapping;
  mb?: number;
  isRequired: boolean;
  isCreate?: boolean;
  hint?: string;
  simpleUpload?: boolean;
  children?;
}

export default function ImageUploaderField({
  name,
  label,
  simpleUpload,
  isRequired = false,
  setFieldMapping,
  setShowMapping,
  mb = 4
}: IDropzoneProps) {
  const { field, fieldState } = useController({ name, defaultValue: "" });

  return (
    <FormControl isRequired={isRequired} isInvalid={!!fieldState.error} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <DropTarget
        simpleUpload={simpleUpload}
        setFieldMapping={setFieldMapping}
        setShowMapping={setShowMapping}
        field={field}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
    </FormControl>
  );
}
