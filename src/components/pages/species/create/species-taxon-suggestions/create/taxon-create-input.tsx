import { Box, Button, Flex, Icon, Input, InputGroup } from "@chakra-ui/react";
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { getByPath } from "@utils/basic";
import React from "react";
import { useFormContext } from "react-hook-form";
import { LuCheck } from "react-icons/lu";

import { Field } from "@/components/ui/field";

interface TaxonCreateInputFieldProps {
  name: string;
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  mb?: number;
  onValidate?;
  hidden?;
  hint?;
}

export const TaxonCreateInputField = ({
  name,
  label,
  isRequired,
  isDisabled,
  hidden,
  onValidate,
  mb = 4,
  hint = ""
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
    if (fieldWatch) {
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
        startAddon={
          <Flex minW="8rem" align="center" gap={1}>
            <Box>{label}</Box>
            {isRequired && <Box color="red.500">*</Box>}
          </Flex>
        }
        endElement={
          errors[name] ? (
            <Box width="5.4rem">
              <Button onClick={onValidateClick} h="1.75rem" size="sm" colorPalette="red">
                validate
              </Button>
            </Box>
          ) : (
            !isDisabled &&
            fieldWatch && (
              <Box>
                <Icon as={LuCheck} color="green.500" />
              </Box>
            )
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
      {hint && <Field color="red.600" helperText={hint} />}
    </Field>
  );
};
