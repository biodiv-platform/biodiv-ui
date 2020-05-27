import { Box, Flex, Image, Link } from "@chakra-ui/core";
import React from "react";

export default function GroupBox({ link, icon, name }) {
  return (
    <Box className="trait-button color" overflow="hidden" title={name} aria-checked={false}>
      <Flex alignItems="center">
        <Image size="2rem" mr={2} objectFit="contain" src={icon} alt={name} />
        <Link href={link} lineHeight="1rem" className="elipsis-2">
          {name}
        </Link>
      </Flex>
    </Box>
  );
}
