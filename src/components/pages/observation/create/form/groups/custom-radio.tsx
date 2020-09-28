import { Box, Image, useRadio } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import { getSpeciesIcon } from "@utils/media";
import React from "react";

const CustomRadio = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const handleOnChange = (e) => {
    props.onChange(props.isChecked ? null : Number(e.target.value));
  };

  return (
    <Box as="label" display="inline-block" mr={2}>
      <input {...getInputProps()} onChange={() => null} onClick={handleOnChange} />
      <Tooltip title={props.icon} placement="top" hasArrow={true}>
        <Box
          {...getCheckboxProps()}
          p={1}
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
        >
          <Image
            boxSize="3rem"
            style={{ filter: props.isChecked ? "none" : "grayscale(1)" }}
            src={getSpeciesIcon(props.icon)}
            alt={props.icon}
          />
        </Box>
      </Tooltip>
    </Box>
  );
};

export default CustomRadio;
