import { Box, Image, Stack, Tooltip, Text } from "@chakra-ui/core";
import { getLocalIcon } from "@utils/media";
import React, { useMemo } from "react";

export default function FilterIconList({ filterIds, filterList, title, type, icon }) {
  const filters: any[] = useMemo(
    () => filterList.filter((item) => filterIds.includes(item.id)),
    []
  );

  return (
    <Box ml={2}>
      <Stack isInline={true}>
        <span>
          <Text title={title}>{icon}</Text>
        </span>
        {filters.map(({ name, id }) => (
          <Box key={id}>
            <Tooltip aria-label={name} label={name} placement="top" hasArrow={true}>
              <Image
                boxSize="2rem"
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
