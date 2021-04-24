import { FormControl, FormLabel } from "@chakra-ui/react";
import ErrorMessage from "@components/form/common/error-message";
import { getByPath } from "@utils/basic";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

import DropTarget from "./drop-target";

interface IDropzoneProps {
  name: string;
  label: string;
  setFieldMapping: any;
  setShowMapping;
  mb?: number;
  isRequired: boolean;
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
  simpleUpload,
  isRequired = false,
  setFieldMapping,
  setShowMapping,
  mb = 4
}: IDropzoneProps) {
  const [value, setvalue] = useState<string>(
    getByPath(form?.control?.defaultValuesRef?.current, name) || ""
  );

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  useEffect(() => {
    if (value?.length > 0) {
      form.setValue(name, value);
      setShowMapping(true);
    }
  }, [value]);

  return (
    <FormControl isRequired={isRequired} isInvalid={form.errors[name] && true} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <DropTarget
        simpleUpload={simpleUpload}
        setFieldMapping={setFieldMapping}
        setValue={setvalue}
      />
      <ErrorMessage name={name} errors={form.errors} />
    </FormControl>
  );
}
