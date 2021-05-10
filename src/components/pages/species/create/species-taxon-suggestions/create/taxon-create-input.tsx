import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement
} from "@chakra-ui/react";
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { getByPath } from "@utils/basic";
import React from "react";
import { useFormContext } from "react-hook-form";

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
  const { register, control, errors, watch, setError } = useFormContext();

  const fieldWatch = watch(name);

  useDidUpdateEffect(() => {
    if (isRequired && fieldWatch) {
      setError(name, { type: "manual", message: "err" });
    }
  }, [fieldWatch]);

  const onValidateClick = () => onValidate(name, fieldWatch);

  return (
    <FormControl
      isInvalid={errors[name]}
      mb={mb}
      hidden={hidden}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      <InputGroup>
        <InputLeftAddon minW="8rem">
          {label} {isRequired && "*"}
        </InputLeftAddon>
        <Input
          name={name}
          id={name}
          placeholder={label}
          ref={register}
          defaultValue={getByPath(control.defaultValuesRef.current, name)}
        />
        {errors[name] && (
          <InputRightElement width="5.4rem">
            <Button onClick={onValidateClick} h="1.75rem" size="sm" colorScheme="red">
              validate
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};