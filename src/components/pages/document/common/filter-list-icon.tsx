import { Box, Image, Stack } from "@chakra-ui/react";
import { getLocalIcon } from "@utils/media";
import React, { useMemo } from "react";

import { Tooltip } from "@/components/ui/tooltip";

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
    <Stack direction={"row"} gap={0}>
      {filters.map(({ name, id }) => (
        <Box key={id}>
          <Tooltip
            aria-label={name}
            content={name}
            positioning={{ placement: "top" }}
            showArrow={true}
          >
            <Image
              boxSize="1.7em"
              src={getLocalIcon(name, type)}
              alt={name}
            />
          </Tooltip>
        </Box>
      ))}
    </Stack>
  );
}
