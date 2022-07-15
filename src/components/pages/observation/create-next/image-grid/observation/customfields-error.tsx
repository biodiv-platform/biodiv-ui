import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function CustomfieldsError({ idx }) {
  const hForm = useFormContext();

  useEffect(() => {
    hForm.trigger(`o.${idx}.customFields`);
  }, [hForm.trigger]);

  return (hForm.formState.errors?.o?.[idx]?.customFields as any)?.filter((o) => o)?.length ? (
    <FormControl isInvalid={true}>
      <FormErrorMessage children="*Some Custom Fields are required" />
    </FormControl>
  ) : null;
}
