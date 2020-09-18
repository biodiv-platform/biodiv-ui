import { Flex, Image, Text } from "@chakra-ui/core";
import { getTraitIcon } from "@utils/media";
import React from "react";

export default function Content({ value, label, icon }) {
  return (
    <Flex alignItems="center">
      <Image boxSize="2rem" mr={2} objectFit="contain" src={getTraitIcon(icon)} alt={value} />
      <Text>{label}</Text>
    </Flex>
  );
}
