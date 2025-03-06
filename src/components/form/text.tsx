import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Textarea
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef } from "react";
import { useController } from "react-hook-form";

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
  onChangeCallback?;
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
  onChangeCallback,
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
    <FormControl
      isInvalid={!!fieldState.error}
      mb={mb}
      hidden={hidden}
      isRequired={isRequired}
      {...props}
    >
      {showLabel && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputComponent
        id={id || name}
        placeholder={label}
        type={type}
        maxLength={maxLength}
        isDisabled={disabled}
        autoComplete={autoComplete}
        resize="none"
        overflow="hidden"
        rows={1}
        {...field}
        onChange={(e) => {
          field.onChange(e);
          onChangeCallback && onChangeCallback(e);
          adjustHeight();
        }}
        ref={(element) => {
          if (multiline) {
            textareaRef.current = element;
          }
          field.ref(element);
        }}
        sx={
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
      <FormErrorMessage children={fieldState?.error?.message} />
      {maxLength && field.value && (
        <FormHelperText color="gray.600" children={`${field.value.length}/${maxLength}`} />
      )}
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
