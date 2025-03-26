import { Box, Heading, Image, Stack } from "@chakra-ui/react";
import { getLocalIcon } from "@utils/media";
import React, { useMemo } from "react";

import { Tooltip } from "@/components/ui/tooltip";

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
      <Stack direction={"row"}>
        {filters.map(({ name, id }) => (
          <Box key={id}>
            <Tooltip
              aria-label={name}
              content={name}
              positioning={{ placement: "top" }}
              showArrow={true}
            >
              <Image boxSize="3rem" src={getLocalIcon(name, type)} alt={name} />
            </Tooltip>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
