import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";

export default function CustomfieldsError({ idx }) {
  const hForm = useFormContext();

  useEffect(() => {
    hForm.trigger(`o.${idx}.customFields`);
  }, [hForm.trigger]);

  return (hForm.formState.errors?.o?.[idx]?.customFields as any)?.filter((o) => o)?.length ? (
    <Field invalid={true} errorText="*Some Custom Fields are required"></Field>
  ) : null;
}
