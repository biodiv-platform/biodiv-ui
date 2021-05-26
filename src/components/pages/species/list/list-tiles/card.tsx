import { Box, Heading, Image, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { RESOURCE_SIZE } from "@static/constants";
import { OBSERVATION_FALLBACK } from "@static/inline-images";
import { getResourceThumbnail } from "@utils/media";
import { getInjectableHTML, stripTags } from "@utils/text";
import React from "react";

export default function GridViewCard({ o }) {
  const name = getInjectableHTML(o.name);
  const simpleName = stripTags(o.name);

  return (
    <Box className="hover-box fade">
      <LocalLink href={`/species/show/${o.id}`} prefixGroup={true}>
        <Link>
          <Box w="full" position="relative" h="14rem">
            <Image
              objectFit="cover"
              p={0}
              bg="white"
              w="full"
              h="full"
              src={getResourceThumbnail(o.context, o.reprImage, RESOURCE_SIZE.LIST_THUMBNAIL)}
              fallbackSrc={OBSERVATION_FALLBACK.PHOTO}
              alt={simpleName}
            />
          </Box>
          <Box h="4.6rem" p={4} bg="gray.100">
            <Heading
              className="elipsis-2"
              size="sm"
              title={simpleName}
              dangerouslySetInnerHTML={{ __html: name }}
            />
          </Box>
        </Link>
      </LocalLink>
    </Box>
  );
}
