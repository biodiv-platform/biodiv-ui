import { Box, Image, Stack, Tooltip } from "@chakra-ui/core";
import { getLocalIcon } from "@utils/media";
import React, { useMemo } from "react";

export default function FilterIconList({ filterIds, filterList, title, type }) {
  const filters: any[] = useMemo(
    () => filterList.filter((item) => filterIds.includes(item.id)),
    []
  );

  return (
    <Box m={2}>
      <Stack isInline={true}>
        <span>{title} :</span>
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
