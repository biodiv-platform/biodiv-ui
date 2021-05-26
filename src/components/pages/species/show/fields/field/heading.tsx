import { LinkIcon } from "@chakra-ui/icons";
import { Box, Link } from "@chakra-ui/react";
import React from "react";
import urlSlug from "url-slug";

const titleSize = ["xl", "lg", "md"];

export default function SpeciesFieldHeading({ id, title, level }) {
  const slugId = urlSlug(id);
  return (
    <Link
      id={slugId}
      href={`#${slugId}`}
      display="inline-block"
      fontWeight="bold"
      fontSize={titleSize[level]}
      lineHeight={1}
    >
      {title}

      <Box as="span" color="gray.200" ml={2} _hover={{ color: "blue.500" }}>
        <LinkIcon />
      </Box>
    </Link>
  );
}
