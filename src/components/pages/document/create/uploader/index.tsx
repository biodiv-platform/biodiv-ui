import { FormControl, FormErrorMessage, FormHelperText } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { ManageDocumentContextProvider } from "./document-upload-provider";
import DocumentUploaderTabs from "./tabs";

interface DocumentUploaderProps {
  name: string;
  hint?;
}

export default function DocumentUploader({ name, hint }: DocumentUploaderProps) {
  const { field, fieldState } = useController({ name });

  return (
    <ManageDocumentContextProvider initialDocument={field.value}>
      <FormControl isInvalid={!!fieldState.error} mb={4}>
        <DocumentUploaderTabs {...field} />
        <FormErrorMessage children={fieldState?.error?.message} />
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
    </ManageDocumentContextProvider>
  );
}
