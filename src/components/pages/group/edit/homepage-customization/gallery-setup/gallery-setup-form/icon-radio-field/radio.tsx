import { Box, HStack, Image, useRadio, useRadioGroup } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import { getObservationThumbnail } from "@utils/media";
import React from "react";

interface ITraitInputProps {
  onChange?;
  form;
  name;
  options: any[];
  gridColumns?;
  defaultValue?;
}

const CustomRadio = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  return (
    <label>
      <input {...getInputProps()} />
      <Box
        {...getCheckboxProps()}
        p={2}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        bg="white"
        _checked={{
          borderColor: "blue.500",
          bg: "blue.50"
        }}
        _focus={{
          boxShadow: "outline"
        }}
        style={undefined}
      >
        {props.children}
      </Box>
    </label>
  );
};

const RadioItems = ({ options, form, name, defaultValue }: ITraitInputProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange: (v) => form.setValue(name, v)
  });

  return (
    <HStack {...getRootProps()}>
      {options.map((o) => {
        return (
          <CustomRadio key={o.id} {...getRadioProps({ value: o.value })}>
            <Tooltip title={o.name} placement="top" hasArrow={true}>
              <Image
                boxSize="5rem"
                ignoreFallback={true}
                loading="lazy"
                src={getObservationThumbnail(o.value)}
                alt={o.name}
              />
            </Tooltip>
          </CustomRadio>
        );
      })}
    </HStack>
  );
};

export default RadioItems;
