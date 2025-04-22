import { HStack, Separator } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

import CustomRadio from "./custom-radio";

interface ISpeciesSelecProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  hideDevider?;
  isRequired?;
}

const GroupSelector = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  hideDevider,
  isRequired = true,
  ...props
}: ISpeciesSelecProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <>
      <Field
        invalid={!!fieldState.error}
        errorText={fieldState?.error?.message}
        required={isRequired}
        mb={mb}
        htmlFor={name}
        label={label}
        {...props}
      >
        <RadioCard.Root
          name={name}
          value={field.value ? field.value.toString() : ""}
          onValueChange={field.onChange}
          orientation="horizontal"
          align="center"
        >
          <HStack align="stretch">
            {options.map((o) => (
              <CustomRadio key={o.id} value={o.id.toString()} icon={o.name} />
            ))}
          </HStack>
        </RadioCard.Root>
        {hint && <Field color="gray.600" helperText={hint} />}
      </Field>
      {!hideDevider && <Separator mb={4} />}
    </>
  );
};

export default GroupSelector;
