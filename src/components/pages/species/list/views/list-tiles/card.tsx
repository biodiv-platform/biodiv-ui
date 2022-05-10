import { Box, Checkbox, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ScientificName from "@components/@core/scientific-name";
import { Role } from "@interfaces/custom";
import { RESOURCE_SIZE } from "@static/constants";
import { hasAccess } from "@utils/auth";
import { getLocalIcon, getResourceThumbnail } from "@utils/media";
import { getInjectableHTML, stripTags } from "@utils/text";
import React, { useState } from "react";

import useSpeciesList from "../../use-species-list";

export default function GridViewCard({ o, getCheckboxProps }) {
  const name = getInjectableHTML(o.name);
  const simpleName = stripTags(o.name);

  const { species } = useSpeciesList();
  const [canEdit] = useState(hasAccess([Role.Admin, Role.UsergroupFounder, Role.UsergroupExpert]));

  return (
    <Box className="hover-box fade">
      {canEdit && getCheckboxProps && (
        <Checkbox m={2} {...getCheckboxProps({ value: o.id })}></Checkbox>
      )}

      <LocalLink href={`/species/show/${o.id}`} prefixGroup={true}>
        <Link>
          <Box w="full" position="relative" h="14rem">
            <Image
              objectFit="cover"
              p={0}
              bg="white"
              w="full"
              h="full"
              borderTopRadius="md"
              src={getResourceThumbnail(o.context, o.reprImage, RESOURCE_SIZE.LIST_THUMBNAIL)}
              fallbackSrc={getLocalIcon(species?.find((item) => item?.id === o?.sGroup)?.name)}
              alt={simpleName}
            />
          </Box>
          <Flex
            direction="column"
            justifyContent="space-between"
            h="4.6rem"
            p={4}
            bg="gray.100"
            borderBottomRadius="md"
          >
            <Heading className="elipsis-2" size="sm" title={simpleName}>
              <ScientificName value={name} />
            </Heading>
            {o.commonName && (
              <Text color="gray.600" fontSize="sm" title={o.commonName}>
                {o.commonName}
              </Text>
            )}
          </Flex>
        </Link>
      </LocalLink>
    </Box>
  );
}
