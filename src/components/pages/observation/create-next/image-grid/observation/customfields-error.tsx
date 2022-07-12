import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function CustomfieldsError({ name }) {
  const hForm = useFormContext();

  return (
    <ErrorMessage
      errors={hForm.formState.errors}
      name={name}
      render={(o) => (
        <FormControl isInvalid={!!o.message}>
          <FormErrorMessage children={o.message} />
        </FormControl>
      )}
    />
  );
}
