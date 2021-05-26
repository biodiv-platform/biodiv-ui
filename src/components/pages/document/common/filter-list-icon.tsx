import { Box, Image, Stack, Tooltip } from "@chakra-ui/react";
import { getLocalIcon } from "@utils/media";
import React, { useMemo } from "react";

interface FilterIconListProps {
  filterIds;
  filterList;
  type;
}

export default function FilterIconList({
  filterIds = [],
  filterList = [],
  type
}: FilterIconListProps) {
  const filters: any[] = useMemo(
    () => filterList.filter((item) => filterIds.includes(item.id)),
    [filterIds, filterList]
  );

  if (!filters.length) {
    <Box minH="1.68rem">-</Box>;
  }

  return (
    <Stack isInline={true} spacing={0}>
      {filters.map(({ name, id }) => (
        <Box key={id}>
          <Tooltip aria-label={name} label={name} placement="top" hasArrow={true}>
            <Image
              boxSize="1.7em"
              ignoreFallback={true}
              src={getLocalIcon(name, type)}
              alt={name}
            />
          </Tooltip>
        </Box>
      ))}
    </Stack>
  );
}
