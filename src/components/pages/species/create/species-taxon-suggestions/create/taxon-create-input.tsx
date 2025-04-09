import { Box, Button, Input } from "@chakra-ui/react";
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { getByPath } from "@utils/basic";
import React from "react";
import { useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

interface TaxonCreateInputFieldProps {
  name: string;
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  mb?: number;
  onValidate?;
  hidden?;
}

export const TaxonCreateInputField = ({
  name,
  label,
  isRequired,
  isDisabled,
  hidden,
  onValidate,
  mb = 4
}: TaxonCreateInputFieldProps) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setError
  } = useFormContext();

  const fieldWatch = watch(name);

  useDidUpdateEffect(() => {
    if (isRequired && fieldWatch) {
      // scheduling validation so this will trigger always after executing form's validator
      setTimeout(() => {
        setError(name, { type: "manual", message: "err" });
      }, 0);
    }
  }, [fieldWatch]);

  const onValidateClick = () => onValidate(name, fieldWatch);

  return (
    <Field
      invalid={!!errors[name]}
      mb={mb}
      hidden={hidden}
      required={isRequired}
      disabled={isDisabled}
    >
      <InputGroup
        // startAddon={
        //   <Box minW="8rem">
        //     {label} <Box color="red.500">{isRequired && "*"}</Box>
        //   </Box>
        // }
        endElement={
          errors[name] && (
            <Box width="5.4rem">
              <Button onClick={onValidateClick} h="1.75rem" size="sm" colorPalette="red">
                validate
              </Button>
            </Box>
          )
        }
      >
        <Input
          id={name}
          placeholder={label}
          defaultValue={getByPath(control._defaultValues, name)}
          {...register(name)}
        />
      </InputGroup>
    </Field>
  );
};
