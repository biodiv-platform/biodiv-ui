import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import WYSIWYGEditor from "@components/@core/wysiwyg-editor";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface IWYSIWYGFieldProps {
  name: string;
  label?: string;
  mt?: number;
  mb?: number;
  hint?: string;
  uploadHandler?;
  form: UseFormMethods<Record<string, any>>;
}

const WYSIWYGField = ({
  name,
  label,
  form,
  mb = 4,
  hint,
  uploadHandler,
  ...props
}: IWYSIWYGFieldProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    {label && <FormLabel>{label}</FormLabel>}
    <Controller
      control={form.control}
      name={name}
      render={({ onChange, onBlur, value }) => (
        <WYSIWYGEditor
          name={name}
          initialValue={value}
          onEditorChange={onChange}
          placeholder={label}
          onBlur={onBlur}
          uploadHandler={uploadHandler}
        >
          {label}
        </WYSIWYGEditor>
      )}
    />

    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default WYSIWYGField;
