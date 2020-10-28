import "react-quill//dist/quill.snow.css";

import { Box, FormControl, FormHelperText, FormLabel } from "@chakra-ui/core";
import dynamic from "next/dynamic";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface IRichTextareaProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  isRequired?: boolean;
  form: UseFormMethods<Record<string, any>>;
}

const RichTextareaField = ({ name, label, hint, form, mb = 4, ...props }: IRichTextareaProps) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"]
    ]
  };

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <Box borderRadius="md" className="ql-box">
        <Controller
          control={form.control}
          name={name}
          defaultValue={form.control.defaultValuesRef.current[name]}
          render={(props) => <ReactQuill {...props} modules={modules} />}
        />
      </Box>
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default RichTextareaField;
