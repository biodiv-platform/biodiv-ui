import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import ErrorMessage from "@components/form/common/error-message";
import { getByPath } from "@utils/basic";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

import DropTarget from "./drop-target";

interface IDropzoneProps {
  name: string;
  label: string;
  setFieldMapping: any;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
  isCreate?: boolean;
  hint?: string;
  simpleUpload?: boolean;
  children?;
}

export default function ImageUploaderField({
  name,
  label,
  form,
  hint,
  simpleUpload,
  setFieldMapping,
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
    if (value?.length > 0) {
      setFieldMapping(value);
    }
  }, [value]);

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <DropTarget simpleUpload={simpleUpload} setValue={setvalue} />
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
