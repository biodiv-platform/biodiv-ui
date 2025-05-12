import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { getTraitIcon } from "@utils/media";
import React from "react";

export default function TraitContent(props) {
  // const { getInputProps, getCheckboxProps } = useRadio(props);

  const handleOnChange = (e) => {
    props.onChange(props.isChecked ? null : Number(e.target.value));
  };

  return (
    <Box as="label">
      {/* {...getInputProps()} */}
      <input onChange={() => null} onClick={handleOnChange} />
      <Flex
        // {...getCheckboxProps()}
        alignItems="center"
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
      >
        {props.icon && (
          <Image
            boxSize="2rem"
            mr={2}
            objectFit="contain"
            src={getTraitIcon(props.icon)}
            alt={props.value}
          />
        )}
        <Text>{props.label}</Text>
      </Flex>
    </Box>
  );
}
