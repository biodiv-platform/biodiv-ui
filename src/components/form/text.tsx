import { Input, Textarea } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef } from "react";
import { useController } from "react-hook-form";

import { Field } from "../ui/field";

interface ITextBoxProps {
  id?: string;
  name: string;
  label: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  style?;
  maxLength?;
  isRequired?: boolean;
  showLabel?: boolean;
  hidden?;
  autoComplete?;
  multiline?: boolean;
}

export const TextBoxField = ({
  id,
  name,
  label,
  type = "text",
  mb = 4,
  disabled,
  hint,
  isRequired,
  showLabel = true,
  maxLength,
  hidden,
  autoComplete,
  multiline = false,
  ...props
}: ITextBoxProps) => {
  const { field, fieldState } = useController({
    name,
    defaultValue: "" // to prevent uncontrolled to controlled error
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [multiline]);

  useEffect(() => {
    adjustHeight();
  }, [field.value, adjustHeight]);

  const InputComponent = multiline ? Textarea : Input;

  return (
    <Field invalid={!!fieldState.error} mb={mb} hidden={hidden} required={isRequired} {...props}>
      {showLabel && <Field htmlFor={name} label={label} />}
      <InputComponent
        id={id || name}
        placeholder={label}
        type={type}
        maxLength={maxLength}
        disabled={disabled}
        autoComplete={autoComplete}
        resize="none"
        overflow="hidden"
        rows={1}
        {...field}
        onChange={(e) => {
          field.onChange(e);
          adjustHeight();
        }}
        ref={(element) => {
          if (multiline) {
            textareaRef.current = element;
          }
          field.ref(element);
        }}
        css={
          multiline
            ? {
                "&": {
                  minHeight: "40px",
                  height: "auto"
                }
              }
            : undefined
        }
      />
      <Field errorText={fieldState?.error?.message} />
      {maxLength && field.value && (
        <Field color="gray.600" helperText={`${field.value.length}/${maxLength}`} />
      )}
      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
