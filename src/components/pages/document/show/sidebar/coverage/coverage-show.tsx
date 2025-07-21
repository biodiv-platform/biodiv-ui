import { AspectRatio, Image, SimpleGrid } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import { getLocalIcon } from "@utils/media";
import React, { Fragment } from "react";

export const CoverageShow = ({ value, items, type }) => (
  <SimpleGrid columns={5} gap={4} p={4}>
    {items
      .filter((item) => value?.includes(item.id))
      .map((item) => (
        <Fragment key={item.id}>
          <Tooltip title={item.name} showArrow={true} positioning={{ placement: "top" }}>
            <AspectRatio ratio={1}>
              <Image
                overflow="hidden"
                objectFit="cover"
                alt={item.name}
                src={getLocalIcon(item.name, type)}
                border="2px solid"
                borderColor="gray.200"
                p={1}
                borderRadius="md"
              />
            </AspectRatio>
          </Tooltip>
        </Fragment>
      ))}
  </SimpleGrid>
);
