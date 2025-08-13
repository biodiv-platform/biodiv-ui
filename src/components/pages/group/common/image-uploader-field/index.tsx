import { RESOURCE_SIZE } from "@static/constants";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

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
  disabled?: boolean;
  onChangeCallback?
}

export default function ImageUploaderField({
  name,
  label,
  resourcePath,
  nestedPath,
  hint,
  simpleUpload,
  mb = 4,
  disabled,
  onChangeCallback
}: IDropzoneProps) {
  const { field, fieldState } = useController({ name });
  const { t } = useTranslation();

  const handleChange = (value) => {
    field.onChange(value);
    if (onChangeCallback) {
      onChangeCallback(value);
    }
  };

  return (
    <Field
      invalid={!!fieldState.error}
      errorText={fieldState?.error?.message}
      mb={mb}
      htmlFor={name}
      label={label}
    >
      {field.value ? (
        <ResourceCard
          simpleUpload={simpleUpload}
          imageSize={simpleUpload ? "?h=60" : RESOURCE_SIZE.LIST_THUMBNAIL}
          setValue={handleChange}
          resource={field.value}
          disabled={disabled}
        />
      ) : disabled ? (
        <p>{t("group:custom_field.image_unavailable")} </p>
      ) : (
        <DropTarget
          simpleUpload={simpleUpload}
          nestedPath={nestedPath}
          resourcePath={resourcePath}
          setValue={handleChange}
        />
      )}
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
}
