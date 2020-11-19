import { Box, Image, Stack, Text, Tooltip } from "@chakra-ui/react";
import { getLocalIcon } from "@utils/media";
import React, { useMemo } from "react";

export default function FilterIconList({ filterIds, filterList, title, type, icon }) {
  const filters: any[] = useMemo(() => filterList.filter((item) => filterIds.includes(item.id)), [
    filterIds
  ]);

  return (
    <Box ml={2}>
      <Stack isInline={true}>
        <Text mr={1} title={title}>
          {icon}
        </Text>

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
