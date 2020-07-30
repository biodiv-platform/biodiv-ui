import { Box, Heading, Image, Stack, Tooltip } from "@chakra-ui/core";
import { getLocalIcon } from "@utils/media";
import React from "react";

export default function FilterIconList({ filterIds, filterList, title, type }) {
  const filters = filterList.filter((item) => filterIds.includes(item.id));

  return (
    <Box mb={5}>
      <Heading m={3} size="lg">
        {title}
      </Heading>
      <Stack isInline>
        {filters.map(({ name, id }) => (
          <Tooltip key={id} aria-label={name} label={name} placement="top" hasArrow={true}>
            <Image
              m={2}
              size="3rem"
              ignoreFallback={true}
              src={getLocalIcon(name, type)}
              alt={name}
            />
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}
