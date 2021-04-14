import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import ErrorMessage from "@components/form/common/error-message";
import { RESOURCE_SIZE } from "@static/constants";
import { getByPath } from "@utils/basic";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

import DropTarget from "./drop-target";
import ResourceCard from "./image-card";

interface IDropzoneProps {
  name: string;
  label: string;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
  isCreate?: boolean;
  hint?: string;
  nestedPath?: string;
  resourcePath?: string;
  simpleUpload?: boolean;
  children?;
}

export default function ImageUploaderField({
  name,
  label,
  form,
  resourcePath,
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
          imageSize={simpleUpload ? "?h=60" : RESOURCE_SIZE.LIST_THUMBNAIL}
          setValue={setvalue}
          resourceName={resourcePath}
          resource={value}
        />
      ) : (
        <DropTarget
          simpleUpload={simpleUpload}
          nestedPath={nestedPath}
          resourcePath={resourcePath}
          setValue={setvalue}
        />
      )}
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
