import { Image, SimpleGrid } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import { getLocalIcon } from "@utils/media";
import React from "react";
import { useMemo } from "react";

export default function IconsList({ items, values, type }) {
  const itemsFiltered = useMemo(() => items.filter(({ id }) => values.includes(id)), [values]);

  return (
    <SimpleGrid columns={5}>
      {itemsFiltered.map((item) => (
        <Tooltip title={item.name} key={item.id} placement="top" hasArrow={true}>
          <Image
            boxSize="2rem"
            minW="1.5rem"
            ignoreFallback={true}
            loading="lazy"
            src={getLocalIcon(item.name, type)}
            alt={item.name}
          />
        </Tooltip>
      ))}
    </SimpleGrid>
  );
}
