import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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

  const [value, setvalue] = useState<string>(field.value);

  useEffect(() => {
    if (value?.length > 0) {
      field.onChange(value);
    }
  }, [value]);

  return (
    <FormControl isRequired={isRequired} isInvalid={fieldState.invalid} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <DropTarget
        simpleUpload={simpleUpload}
        setFieldMapping={setFieldMapping}
        setShowMapping={setShowMapping}
        setValue={setvalue}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
    </FormControl>
  );
}
