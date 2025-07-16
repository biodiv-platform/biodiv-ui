import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

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
      <Field invalid={!!fieldState.error} errorText={fieldState?.error?.message} mb={4}>
        <DocumentUploaderTabs {...field} externalUrl={field.name == "externalUrl"} />
        {hint && <Field color="gray.600" helperText={hint} />}
      </Field>
    </ManageDocumentContextProvider>
  );
}
