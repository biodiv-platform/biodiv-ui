import { Flex, Image, Text } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import { getTraitIcon } from "@utils/media";
import React from "react";

export default function TraitContent({ value, label, icon }) {
  return (
    <RadioCard.Item value={value} key={value} as="label">
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl
        cursor="pointer"
        _focus={{
          boxShadow: "outline"
        }}
        alignItems="center"
        borderColor="gray.200"
        borderRadius="md"
        borderStyle="solid"
        lineHeight={1}
        p={2}
        h="3.25rem"
        _checked={{
          borderColor: "blue.500",
          bg: "blue.50"
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
