import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

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
    <Field
      required={isRequired}
      invalid={!!fieldState.error}
      htmlFor={name}
      label={label}
      errorText={fieldState?.error?.message}
      mb={mb}
    >
      <DropTarget
        simpleUpload={simpleUpload}
        setFieldMapping={setFieldMapping}
        setShowMapping={setShowMapping}
        field={field}
      />
    </Field>
  );
}
