import { Box, Flex, Image, Link } from "@chakra-ui/react";
import React from "react";

export default function GroupBox({ link, icon, name }) {
  return (
    <Box p={2} borderWidth="2px" borderRadius="md" bg="white" title={name} overflow="hidden">
      <Flex alignItems="center">
        <Image boxSize="2rem" mr={2} objectFit="contain" loading="lazy" src={icon} alt={name} />
        <Link href={link} lineHeight="1rem" className="elipsis-2">
          {name}
        </Link>
      </Flex>
    </Box>
  );
}
