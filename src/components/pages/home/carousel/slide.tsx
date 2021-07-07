import { Box, Image } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React from "react";

export default function Slide({ resource }) {
  const resourceType =  resource.authorId? RESOURCE_CTX.OBSERVATION:RESOURCE_CTX.USERGROUPS;
  const SlideImage = () => (
    <Image
      src={getResourceThumbnail(
        resourceType,
        resource?.fileName,
        RESOURCE_SIZE.PREVIEW
      )}
      h={{ base: 240, md: 420, lg: 500 }}
      w="full"
      objectFit="cover"
      loading="lazy"
      ignoreFallback={true}
      alt={resource.id}
    />
  );

  return (
    <Box className="keen-slider__slide" style={{ minWidth: "100%" }}>
      {resource.observationId ? (
        <LocalLink href={`/observation/show/${resource.observationId}`}>
          <a>
            <SlideImage />
          </a>
        </LocalLink>
      ) : (
        <SlideImage />
      )}
    </Box>
  );
}
