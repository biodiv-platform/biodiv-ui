import { Flex, Image, Text } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import { getTraitIcon } from "@utils/media";
import React from "react";

export default function TraitContent({ value, label, icon }) {
  return (
    <RadioCard.Item value={value} key={value} as="label">
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl
        alignItems="center"
        p={2}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        bg="white"
        minW="200px"
        _checked={{
          bg: "blue.50"
        }}
        _focus={{
          boxShadow: "outline"
        }}
      >
        <RadioCard.ItemText>
          <Flex alignItems="center">
            {icon && (
              <Image
                boxSize="2rem"
                mr={2}
                objectFit="contain"
                src={getTraitIcon(icon)}
                alt={label}
              />
            )}
            <Text>{label}</Text>
          </Flex>
        </RadioCard.ItemText>
      </RadioCard.ItemControl>
    </RadioCard.Item>
  );
}
