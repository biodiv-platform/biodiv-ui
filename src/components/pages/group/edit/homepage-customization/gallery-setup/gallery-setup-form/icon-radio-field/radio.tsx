import { Box, HStack, Image } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React from "react";

import { useRadioGroup } from "@/hooks/use-radio-group";

interface ITraitInputProps {
  onChange?;
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

const RadioItems = ({ options, name, defaultValue, onChange }: ITraitInputProps) => {
  const { getRootProps, getItemProps } = useRadioGroup({
    name,
    defaultValue,
    onChange
  });

  return (
    <HStack {...getRootProps()}>
      {options.map((o) => {
        return (
          <CustomRadio key={o.id} {...getItemProps({ value: o.value })}>
            <Tooltip title={o.name} positioning={{placement:"top"}} showArrow={true}>
              <Image
                boxSize="5rem"
                // ignoreFallback={true}
                loading="lazy"
                src={getResourceThumbnail(RESOURCE_CTX.OBSERVATION, o.value, RESOURCE_SIZE.DEFAULT)}
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
