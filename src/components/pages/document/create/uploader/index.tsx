import { FormControl, FormHelperText } from "@chakra-ui/react";
import ErrorMessage from "@components/form/common/error-message";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import { ManageDocumentContextProvider } from "./document-upload-provider";
import DocumentUploaderTabs from "./tabs";

interface DocumentUploaderProps {
  name: string;
  form: UseFormMethods<Record<string, any>>;
  hint?;
}

export default function DocumentUploader({ form, name, hint }: DocumentUploaderProps) {
  return (
    <ManageDocumentContextProvider>
      <FormControl isInvalid={form.errors[name] && true} mb={4}>
        <Controller
          control={form.control}
          name={name}
          render={(props) => <DocumentUploaderTabs {...props} />}
          defaultValue={form.control.defaultValuesRef.current[name]}
        />
        <ErrorMessage name={name} errors={form.errors} />
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
    </ManageDocumentContextProvider>
  );
}
