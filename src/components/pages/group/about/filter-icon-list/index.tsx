import { Box, Heading, Image, Stack, Tooltip } from "@chakra-ui/react";
import { getLocalIcon } from "@utils/media";
import React, { useMemo } from "react";

export default function FilterIconList({ filterIds, filterList, title, type }) {
  const filters: any[] = useMemo(
    () => filterList.filter((item) => filterIds.includes(item.id)),
    []
  );

  return (
    <Box mb={6}>
      <Heading size="lg" as="h2" mb={4}>
        {title}
      </Heading>
      <Stack isInline={true}>
        {filters.map(({ name, id }) => (
          <Box key={id}>
            <Tooltip aria-label={name} label={name} placement="top" hasArrow={true}>
              <Image
                boxSize="3rem"
                ignoreFallback={true}
                src={getLocalIcon(name, type)}
                alt={name}
              />
            </Tooltip>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
