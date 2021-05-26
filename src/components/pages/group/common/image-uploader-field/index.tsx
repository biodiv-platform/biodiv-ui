import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import { RESOURCE_SIZE } from "@static/constants";
import React from "react";
import { useController } from "react-hook-form";

import DropTarget from "./drop-target";
import ResourceCard from "./image-card";

interface IDropzoneProps {
  name: string;
  label: string;
  mb?: number;
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
  resourcePath,
  nestedPath,
  hint,
  simpleUpload,
  mb = 4
}: IDropzoneProps) {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl isInvalid={fieldState.invalid} mb={mb}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {field.value ? (
        <ResourceCard
          simpleUpload={simpleUpload}
          imageSize={simpleUpload ? "?h=60" : RESOURCE_SIZE.LIST_THUMBNAIL}
          setValue={field.onChange}
          resource={field.value}
        />
      ) : (
        <DropTarget
          simpleUpload={simpleUpload}
          nestedPath={nestedPath}
          resourcePath={resourcePath}
          setValue={field.onChange}
        />
      )}
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
