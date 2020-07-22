import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from "@chakra-ui/core";
import { getByPath } from "@utils/basic";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

import DropTarget from "./drop-target";
import ResourceCard from "./image-card";

export interface IDropzoneProps {
  name: string;
  label: string;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
  isCreate?: boolean;
  hint?: string;
  nestedPath?: string;
  simpleUpload?: boolean;
  children?;
}

export default function ImageUploaderField({
  name,
  label,
  form,
  nestedPath,
  hint,
  simpleUpload,
  mb = 4
}: IDropzoneProps) {
  const [value, setvalue] = useState(
    getByPath(form?.control?.defaultValuesRef?.current, name) || ""
  );

  useEffect(() => {
    form.register({ name });
    setvalue(getByPath(form?.control?.defaultValuesRef?.current, name));
  }, [form.register]);

  useEffect(() => {
    form.setValue(name, value);
  }, [value]);

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {value ? (
        <ResourceCard
          simpleUpload={simpleUpload}
          imageSize={simpleUpload ? 60 : 300}
          setValue={setvalue}
          resource={value}
        />
      ) : (
        <DropTarget simpleUpload={simpleUpload} nestedPath={nestedPath} setValue={setvalue} />
      )}
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
