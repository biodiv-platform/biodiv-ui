import { FormLabel, FormControl } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { FormContextValues } from "react-hook-form";

import DropTarget from "./drop-target";
import ResourceCard from "./image-card";

export interface IDropzoneProps {
  name: string;
  label: string;
  mb?: number;
  form: FormContextValues<any>;
  isCreate?: boolean;
  children?;
}

export default function ImageUploaderField({ name, label, form, mb = 4 }: IDropzoneProps) {
  const [value, setvalue] = useState(form?.control?.defaultValuesRef?.current[name] || "");

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  useEffect(() => {
    form.setValue(name, value);
  }, [value]);

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {value ? (
        <ResourceCard setValue={setvalue} resource={value} />
      ) : (
        <DropTarget setValue={setvalue} />
      )}
    </FormControl>
  );
}